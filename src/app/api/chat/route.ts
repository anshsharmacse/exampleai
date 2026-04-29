import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { AI_MODELS, RATE_LIMITS, CREDIT_PRICING } from "@/lib/models";

const rateLimitCache = new Map<string, { requests: number; lastReset: number }>();

function checkRateLimit(userId: string, plan: string) {
  const now = Date.now();
  const key = `${userId}:${plan}`;
  const limit = RATE_LIMITS[plan as keyof typeof RATE_LIMITS];
  const cached = rateLimitCache.get(key);
  if (!cached || now - cached.lastReset > 3600000) {
    rateLimitCache.set(key, { requests: 1, lastReset: now });
    return { allowed: true, remaining: limit.maxRequestsPerHour - 1 };
  }
  if (cached.requests >= limit.maxRequestsPerHour) return { allowed: false, remaining: 0 };
  cached.requests++;
  return { allowed: true, remaining: limit.maxRequestsPerHour - cached.requests };
}

function getGroqModelId(modelId: string): string {
  return AI_MODELS.find((m) => m.id === modelId)?.groqModelId || "llama-3.1-8b-instant";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const body = await request.json();
    const { messages, model: modelId, sessionId } = body;
    if (!messages || !modelId) return NextResponse.json({ error: "Messages and model required" }, { status: 400 });

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const plan = user.plan as "free" | "premium";
    const { allowed, remaining } = checkRateLimit(userId, plan);
    if (!allowed) return NextResponse.json({ error: "Rate limit exceeded. Upgrade to Pro.", remainingRequests: 0 }, { status: 429 });

    if (!AI_MODELS.find((m) => m.id === modelId)) return NextResponse.json({ error: "Model not found" }, { status: 404 });

    if (plan === "premium" && user.credits < CREDIT_PRICING.creditsPerRequest)
      return NextResponse.json({ error: "Insufficient credits." }, { status: 402 });

    let chatSession;
    if (sessionId) chatSession = await db.chatSession.findFirst({ where: { id: sessionId, userId } });
    if (!chatSession) {
      chatSession = await db.chatSession.create({
        data: { userId, model: modelId, title: messages[messages.length - 1]?.content?.slice(0, 50) || "New Chat" },
      });
    }
    await db.message.create({ data: { sessionId: chatSession.id, role: "user", content: messages[messages.length - 1].content, model: modelId } });

    // Resolve API key: env > user stored keys
    let groqKey = process.env.GROQ_API_KEY || "";
    let nvidiaKey = process.env.NVIDIA_API_KEY || "";
    if (user.apiKeys) {
      try {
        const keys = JSON.parse(user.apiKeys);
        if (keys.groq) groqKey = keys.groq;
        if (keys.nvidia) nvidiaKey = keys.nvidia;
      } catch {}
    }

    if (groqKey) return streamFromGroq(messages, modelId, chatSession.id, userId, plan, groqKey, remaining);
    if (nvidiaKey) return streamFromNVIDIA(messages, modelId, chatSession.id, userId, plan, nvidiaKey, remaining);
    return streamDemo(messages, modelId, chatSession.id, userId, plan, remaining);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ===================== GROQ (FREE, PRIMARY) =====================
async function streamFromGroq(messages: Array<{ role: string; content: string }>, modelId: string, sessionId: string, userId: string, plan: string, apiKey: string, remainingRequests: number) {
  const encoder = new TextEncoder();
  const groqModel = getGroqModelId(modelId);
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: groqModel,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            max_tokens: RATE_LIMITS[plan as keyof typeof RATE_LIMITS].maxTokensPerRequest,
            stream: true,
            temperature: 0.7,
            top_p: 0.9,
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          // Fallback to demo on Groq failure
          const demo = await getDemoChunks(messages, modelId, sessionId, userId, plan, remainingRequests);
          for (const c of demo) controller.enqueue(encoder.encode(c));
          controller.close(); return;
        }
        const reader = res.body?.getReader();
        if (!reader) { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "No stream" })}\n\n`)); controller.close(); return; }

        let fullContent = "";
        const decoder = new TextDecoder();
        let buffer = "";
        let realInputTokens = 0, realOutputTokens = 0;

        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n"); buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) { fullContent += delta; controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)); }
              // Groq sends usage in final chunk
              if (parsed.usage) {
                realInputTokens = parsed.usage.prompt_tokens || 0;
                realOutputTokens = parsed.usage.completion_tokens || 0;
              }
            } catch {}
          }
        }

        await saveUsageWithTokens(sessionId, userId, plan, modelId, realInputTokens, realOutputTokens, fullContent);
        const modelName = AI_MODELS.find((m) => m.id === modelId)?.name;
        const usageData = await getUsagePayload(userId, plan, realInputTokens, realOutputTokens, modelName, remainingRequests, false);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "usage", ...usageData })}\n\n`));
        controller.close();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Stream error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}

// ===================== NVIDIA (FALLBACK) =====================
async function streamFromNVIDIA(messages: Array<{ role: string; content: string }>, modelId: string, sessionId: string, userId: string, plan: string, apiKey: string, remainingRequests: number) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ model: modelId, messages: messages.map((m) => ({ role: m.role, content: m.content })), max_tokens: RATE_LIMITS[plan as keyof typeof RATE_LIMITS].maxTokensPerRequest, stream: true, temperature: 0.7 }),
        });
        if (!res.ok) { const demo = await getDemoChunks(messages, modelId, sessionId, userId, plan, remainingRequests); for (const c of demo) controller.enqueue(encoder.encode(c)); controller.close(); return; }
        const reader = res.body?.getReader(); if (!reader) { controller.close(); return; }
        let fullContent = ""; const decoder = new TextDecoder(); let buffer = "";
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          buffer += decoder.decode(value, { stream: true }); const lines = buffer.split("\n"); buffer = lines.pop() || "";
          for (const line of lines) { const t = line.trim(); if (!t.startsWith("data: ")) continue; const d = t.slice(6); if (d === "[DONE]") continue; try { const p = JSON.parse(d); const delta = p.choices?.[0]?.delta?.content; if (delta) { fullContent += delta; controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)); } } catch {} }
        }
        const inT = messages.reduce((a, m) => a + Math.ceil(m.content.length / 4), 0);
        const outT = Math.ceil(fullContent.length / 4);
        await saveUsageWithTokens(sessionId, userId, plan, modelId, inT, outT, fullContent);
        const mn = AI_MODELS.find((m) => m.id === modelId)?.name;
        const ud = await getUsagePayload(userId, plan, inT, outT, mn, remainingRequests, false);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "usage", ...ud })}\n\n`));
        controller.close();
      } catch (error: unknown) { const msg = error instanceof Error ? error.message : "Error"; controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)); controller.close(); }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}

// ===================== DEMO FALLBACK =====================
async function streamDemo(messages: Array<{ role: string; content: string }>, modelId: string, sessionId: string, userId: string, plan: string, remainingRequests: number) {
  const encoder = new TextEncoder();
  const text = generateDemoResponse(messages[messages.length - 1]?.content || "", modelId);
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let fullContent = "";
        for (const word of text.split(/(\s+)/)) {
          fullContent += word;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word })}\n\n`));
          await new Promise((r) => setTimeout(r, 15 + Math.random() * 25));
        }
        const inT = messages.reduce((a, m) => a + Math.ceil(m.content.length / 4), 0);
        const outT = Math.ceil(fullContent.length / 4);
        await saveUsageWithTokens(sessionId, userId, plan, modelId, inT, outT, fullContent);
        const mn = AI_MODELS.find((m) => m.id === modelId)?.name;
        const ud = await getUsagePayload(userId, plan, inT, outT, mn, remainingRequests, true);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "usage", ...ud })}\n\n`));
        controller.close();
      } catch (e) { controller.close(); }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}

async function getDemoChunks(messages: Array<{ role: string; content: string }>, modelId: string, sessionId: string, userId: string, plan: string, remainingRequests: number): Promise<string[]> {
  const text = generateDemoResponse(messages[messages.length - 1]?.content || "", modelId);
  const chunks: string[] = [];
  let fullContent = "";
  for (const word of text.split(/(\s+)/)) { fullContent += word; chunks.push(`data: ${JSON.stringify({ content: word })}\n\n`); }
  const inT = messages.reduce((a, m) => a + Math.ceil(m.content.length / 4), 0);
  const outT = Math.ceil(fullContent.length / 4);
  await saveUsageWithTokens(sessionId, userId, plan, modelId, inT, outT, fullContent);
  const mn = AI_MODELS.find((m) => m.id === modelId)?.name;
  const ud = await getUsagePayload(userId, plan, inT, outT, mn, remainingRequests, true);
  chunks.push(`data: ${JSON.stringify({ type: "usage", ...ud })}\n\n`);
  return chunks;
}

// ===================== HELPERS =====================
async function saveUsageWithTokens(sessionId: string, userId: string, plan: string, modelId: string, inputTokens: number, outputTokens: number, content: string) {
  const cachedTokens = Math.floor(inputTokens * 0.3);
  await db.message.create({ data: { sessionId, role: "assistant", content, inputTokens, outputTokens, cachedTokens, model: modelId } });
  const creditsUsed = plan === "premium" ? CREDIT_PRICING.creditsPerRequest : 0;
  const costUsd = creditsUsed * CREDIT_PRICING.pricePerCredit;
  await db.usageRecord.create({ data: { userId, inputTokens, outputTokens, cachedTokens, creditsUsed, costUsd, model: modelId } });
  if (plan === "premium" && creditsUsed > 0) {
    await db.user.update({ where: { id: userId }, data: { credits: { decrement: creditsUsed }, totalSpent: { increment: costUsd } } });
  }
}

async function getUsagePayload(userId: string, plan: string, inputTokens: number, outputTokens: number, modelName?: string, remainingRequests?: number, demo?: boolean) {
  const cachedTokens = Math.floor(inputTokens * 0.3);
  const creditsUsed = plan === "premium" ? CREDIT_PRICING.creditsPerRequest : 0;
  const costUsd = creditsUsed * CREDIT_PRICING.pricePerCredit;
  const u = await db.user.findUnique({ where: { id: userId }, select: { credits: true } });
  return {
    inputTokens, outputTokens, cachedTokens, creditsUsed, costUsd,
    model: modelName, remainingRequests: remainingRequests ?? null,
    remainingCredits: plan === "premium" ? Math.max(0, u?.credits || 0) : null,
    demo: demo ?? false,
  };
}

function generateDemoResponse(userMessage: string, modelId: string): string {
  const lower = userMessage.toLowerCase();
  const mn = AI_MODELS.find((m) => m.id === modelId)?.name || modelId;
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey"))
    return `Hello! 👋 Welcome to Example.Ai! I'm powered by **${mn}** via Groq.\n\nI'm currently in **demo mode** because no API key is configured.\n\n→ Go to **Settings** → add your free Groq API key from [console.groq.com](https://console.groq.com/keys)\n\nThen I'll give you real AI responses at blazing speed! 🚀`;
  if (lower.includes("code") || lower.includes("python") || lower.includes("javascript"))
    return `# Code Assistance\n\nI can help with coding once you connect a real AI model.\n\n\`\`\`python\ndef hello():\n    print("Hello from Example.Ai!")\n\`\`\`\n\n→ **Settings** → Add free Groq API key from [console.groq.com](https://console.groq.com/keys)\n\nNo credit card required. Completely free!`;
  return `# Example.Ai — Demo Mode\n\nI'm running in demo mode. To get **real AI responses**:\n\n1. Visit [console.groq.com/keys](https://console.groq.com/keys)\n2. Sign up (free, no credit card)\n3. Copy your API key\n4. Paste it in **Settings** → **Groq API Key**\n\nModels available:\n- Llama 3.1 8B (instant)\n- Llama 3.1 70B (versatile)\n- Llama 3.3 70B (latest)\n- Mixtral 8x7B\n- Gemma 2 9B\n\nAll **100% free** via Groq! ⚡`;
}
