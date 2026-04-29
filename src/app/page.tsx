"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { signOut } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Plus, MessageSquare, BarChart3, CreditCard, Settings,
  Moon, Sun, Trash2, ChevronDown, Menu, Zap, Crown, Sparkles,
  Coins, ArrowUpRight, Loader2, Copy, Check, RotateCcw,
  Brain, Globe, Code, Hash, AlertTriangle, LogOut, PanelLeftClose,
  PanelLeft, Info, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";
import { AI_MODELS, RATE_LIMITS, CREDIT_PRICING } from "@/lib/models";
import type { Message, ChatSession, UsageInfo } from "@/lib/store";

export default function HomePage() {
  const { isAuthenticated, setAuth } = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/user").then((r) => r.json()).then((d) => { if (d.user) setAuth(d.user); }).catch(() => {}).finally(() => setLoading(false));
  }, [setAuth]);
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Sparkles className="w-8 h-8 text-primary" /></motion.div></div>;
  if (!isAuthenticated) return <AuthScreen />;
  return <Dashboard />;
}

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAppStore();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/callback/credentials", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ email, password, name: isLogin ? "" : name, action: isLogin ? "login" : "register", csrfToken: "" }) });
      if (res.ok) { const d = await fetch("/api/user").then((r) => r.json()); if (d.user) setAuth(d.user); } else setError(isLogin ? "Invalid credentials" : "Registration failed");
    } catch { setError("Something went wrong"); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <Card className="border-border/50 shadow-2xl shadow-black/5">
          <CardHeader className="text-center pb-2">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="mx-auto mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center"><Bot className="w-9 h-9 text-primary-foreground" /></div>
            </motion.div>
            <CardTitle className="text-2xl font-bold tracking-tight">Example.Ai</CardTitle>
            <CardDescription>{isLogin ? "Sign in to your account" : "Create your free account"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />}
              <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11" />
              {error && <p className="text-sm text-destructive flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{error}</p>}
              <Button type="submit" className="w-full h-11" disabled={loading}>{loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{isLogin ? "Sign In" : "Create Account"}</Button>
            </form>
            <div className="mt-4 text-center"><button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-sm text-muted-foreground hover:text-foreground">{isLogin ? "Don't have an account? " : "Already have an account? "}<span className="text-primary font-medium">{isLogin ? "Sign up" : "Sign in"}</span></button></div>
            <div className="mt-4 pt-4 border-t"><p className="text-xs text-center text-muted-foreground">🔒 Free plan includes 5 AI models • No credit card required</p></div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function Dashboard() {
  const { activeView, sidebarOpen, setSidebarOpen, setAuth, user } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <aside className={`hidden lg:flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
        <SidebarContent collapsed={!sidebarOpen} onSignOut={() => { signOut({ callbackUrl: "/" }); setAuth(null); }} />
      </aside>
      <AnimatePresence>{mobileMenuOpen && (<>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="fixed left-0 top-0 bottom-0 w-72 z-50 bg-card border-r border-border lg:hidden">
          <SidebarContent collapsed={false} onSignOut={() => { signOut({ callbackUrl: "/" }); setAuth(null); }} onNavigate={() => setMobileMenuOpen(false)} />
        </motion.aside>
      </>)}</AnimatePresence>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/50 bg-card/30 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}><Menu className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}</Button>
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center"><Bot className="w-4 h-4 text-primary-foreground" /></div><span className="font-semibold text-sm">Example.Ai</span></div>
          <div className="flex-1" /><CreditBadge />
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-9 w-9"><Sun className="w-4 h-4 dark:hidden" /><Moon className="w-4 h-4 hidden dark:block" /></Button>
          <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback></Avatar><span className="text-sm font-medium hidden sm:block max-w-[120px] truncate">{user?.name || "User"}</span></div>
        </header>
        <div className="flex-1 overflow-hidden">{activeView === "chat" && <ChatView />}{activeView === "usage" && <UsageView />}{activeView === "pricing" && <PricingView />}{activeView === "settings" && <SettingsView />}</div>
      </main>
    </div>
  );
}

function CreditBadge() {
  const { user } = useAppStore();
  const plan = user?.plan || "free";
  return (<div className="flex items-center gap-1.5"><Badge variant={plan === "premium" ? "default" : "secondary"} className={`text-xs font-semibold px-2.5 py-0.5 ${plan === "premium" ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}`}>{plan === "premium" ? <><Crown className="w-3 h-3 mr-1" /> Pro</> : <><Zap className="w-3 h-3 mr-1" /> Free</>}</Badge>{plan === "premium" && <span className="text-xs font-mono text-muted-foreground">{user?.credits?.toFixed(1)} credits</span>}</div>);
}

function SidebarContent({ collapsed, onSignOut, onNavigate }: { collapsed: boolean; onSignOut: () => void; onNavigate?: () => void }) {
  const { activeView, setActiveView, sessions, setSessions, currentSessionId, setCurrentSessionId, clearChat, addSession } = useAppStore();
  useEffect(() => { fetch("/api/sessions").then((r) => r.json()).then((d) => { if (d.sessions) setSessions(d.sessions.map((s: any) => ({ id: s.id, title: s.title, model: s.model, messageCount: s._count?.messages || 0, lastMessage: s.messages?.[0]?.content?.slice(0, 60), updatedAt: new Date().toISOString() }))); }).catch(() => {}); }, [setSessions]);
  const handleNewChat = async () => { clearChat(); try { const r = await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); const d = await r.json(); if (d.session) { addSession({ ...d.session, messageCount: 0, updatedAt: new Date().toISOString() }); setCurrentSessionId(d.session.id); } } catch {} setActiveView("chat"); onNavigate?.(); };
  const handleDelete = async (e: React.MouseEvent, id: string) => { e.stopPropagation(); await fetch(`/api/sessions?id=${id}`, { method: "DELETE" }); if (currentSessionId === id) clearChat(); useAppStore.getState().removeSession(id); };
  const navItems = [{ id: "chat" as const, label: "Chat", icon: MessageSquare }, { id: "usage" as const, label: "Usage", icon: BarChart3 }, { id: "pricing" as const, label: "Pricing", icon: CreditCard }, { id: "settings" as const, label: "Settings", icon: Settings }];
  return (
    <div className="flex flex-col h-full">
      <div className={`h-14 flex items-center ${collapsed ? "justify-center px-2" : "px-4"} border-b border-border/50`}>{collapsed ? <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><Bot className="w-4 h-4 text-primary-foreground" /></div> : <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><Bot className="w-4 h-4 text-primary-foreground" /></div><span className="font-bold text-lg tracking-tight">Example.Ai</span></div>}</div>
      <div className={`p-3 ${collapsed ? "px-2" : ""}`}><Button onClick={handleNewChat} className="w-full gap-2" variant="outline"><Plus className="w-4 h-4 shrink-0" />{!collapsed && "New Chat"}</Button></div>
      <nav className={`px-3 space-y-1 ${collapsed ? "px-2" : ""}`}>{navItems.map((item) => (<button key={item.id} onClick={() => { setActiveView(item.id); onNavigate?.(); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeView === item.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-accent"} ${collapsed ? "justify-center px-2" : ""}`}><item.icon className="w-4 h-4 shrink-0" />{!collapsed && item.label}</button>))}</nav>
      <Separator className="my-3" />
      {!collapsed && (<div className="flex-1 overflow-hidden flex flex-col"><div className="px-4 py-2 flex items-center justify-between"><span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</span><span className="text-xs text-muted-foreground">{sessions.length}</span></div><ScrollArea className="flex-1 px-2"><div className="space-y-1 pb-4">{sessions.map((s) => (<button key={s.id} onClick={() => { setCurrentSessionId(s.id); setActiveView("chat"); onNavigate?.(); }} className={`w-full group flex items-start gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${currentSessionId === s.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"}`}><MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" /><div className="flex-1 min-w-0"><p className="truncate font-medium">{s.title}</p><p className="text-xs opacity-50 truncate">{s.lastMessage || "Empty"}</p></div><button onClick={(e) => handleDelete(e, s.id)} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-all shrink-0"><Trash2 className="w-3 h-3" /></button></button>))}</div></ScrollArea></div>)}
      <div className={`p-3 border-t border-border/50 ${collapsed ? "px-2" : ""}`}><TooltipProvider><Tooltip><TooltipTrigger asChild><button onClick={onSignOut} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors ${collapsed ? "justify-center px-2" : ""}`}><LogOut className="w-4 h-4 shrink-0" />{!collapsed && "Sign Out"}</button></TooltipTrigger>{collapsed && <TooltipContent side="right">Sign Out</TooltipContent>}</Tooltip></TooltipProvider></div>
    </div>
  );
}

function ChatView() {
  const { messages, addMessage, updateLastMessage, isStreaming, setIsStreaming, currentModel, setCurrentModel, currentSessionId, setCurrentSessionId, setLastUsage, lastUsage, remainingRequests, setRemainingRequests, addSession, clearChat, user, input, setInput } = useAppStore();
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const plan = (user?.plan || "free") as "free" | "premium";
  const rateLimit = RATE_LIMITS[plan];
  const modelData = AI_MODELS.find((m) => m.id === currentModel);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const content = input.trim();
    addMessage({ id: `u-${Date.now()}`, role: "user", content, timestamp: new Date() });
    setInput(""); setIsStreaming(true); setLastUsage(null);
    addMessage({ id: `a-${Date.now()}`, role: "assistant", content: "", timestamp: new Date() });
    try {
      const history = [...messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })), { role: "user", content }];
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history, model: currentModel, sessionId: currentSessionId }) });
      if (!res.ok) { const d = await res.json(); updateLastMessage(`⚠️ ${d.error || "Error"}`); setIsStreaming(false); return; }
      const reader = res.body?.getReader();
      if (!reader) { updateLastMessage("No stream"); setIsStreaming(false); return; }
      const decoder = new TextDecoder(); let buffer = "";
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true }); const lines = buffer.split("\n"); buffer = lines.pop() || "";
        for (const line of lines) { const t = line.trim(); if (!t.startsWith("data: ")) continue; const data = t.slice(6); if (data === "[DONE]") continue;
          try { const p = JSON.parse(data);
            if (p.content) updateLastMessage(p.content);
            if (p.type === "usage") { setLastUsage(p); if (p.remainingRequests != null) setRemainingRequests(p.remainingRequests); if (p.remainingCredits != null) { const st = useAppStore.getState(); if (st.user) st.setAuth({ ...st.user, credits: p.remainingCredits }); } }
            if (p.error) updateLastMessage(p.error);
          } catch {} } }
      if (!currentSessionId) { const ns = await fetch("/api/sessions").then((r) => r.json()); if (ns.sessions?.length) { const l = ns.sessions[0]; setCurrentSessionId(l.id); addSession({ id: l.id, title: l.title, model: l.model, messageCount: l._count?.messages || 0, lastMessage: l.messages?.[0]?.content?.slice(0, 60), updatedAt: new Date().toISOString() }); } }
    } catch (e) { if (e instanceof Error && e.name !== "AbortError") updateLastMessage("Connection error"); } finally { setIsStreaming(false); }
  }, [input, isStreaming, messages, currentModel, currentSessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleCopy = (c: string, id: string) => { navigator.clipboard.writeText(c); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const renderMd = (text: string) => text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((p, i) => { if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>; if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{p.slice(1, -1)}</em>; if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="bg-accent px-1.5 py-0.5 rounded text-xs font-mono">{p.slice(1, -1)}</code>; if (p.startsWith("[") && p.includes("](")) { const [label, ...rest] = p.slice(1, -1).split("]("); return <a key={i} href={rest[0]?.slice(0, -1)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{label}</a>; } return p; });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border/50 bg-card/20 px-4 py-2 flex items-center gap-3 shrink-0">
        <div className="relative">
          <button onClick={() => setShowModelSelector(!showModelSelector)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent/80 text-sm font-medium transition-colors"><Brain className="w-4 h-4 text-primary" /><span className="max-w-[200px] truncate">{modelData?.name || "Model"}</span><ChevronDown className={`w-3.5 h-3.5 transition-transform ${showModelSelector ? "rotate-180" : ""}`} /></button>
          <AnimatePresence>{showModelSelector && (<><div className="fixed inset-0 z-40" onClick={() => setShowModelSelector(false)} /><motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-3 border-b border-border"><h3 className="text-sm font-semibold">AI Model</h3><p className="text-xs text-muted-foreground">5 free models</p></div>
            <div className="max-h-80 overflow-y-auto p-2">{AI_MODELS.map((m) => (<button key={m.id} onClick={() => { setCurrentModel(m.id); setShowModelSelector(false); }} className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${currentModel === m.id ? "bg-primary/10 border border-primary/20" : "hover:bg-accent border border-transparent"}`}><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${currentModel === m.id ? "bg-primary" : "bg-muted-foreground/30"}`} /><span className="text-sm font-medium">{m.name}</span></div><Badge variant="outline" className="text-[10px] px-1.5">Free</Badge></div><p className="text-xs text-muted-foreground mt-1 ml-4">{m.description}</p><div className="flex items-center gap-3 mt-1.5 ml-4 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><Globe className="w-2.5 h-2.5" />{m.contextWindow}</span><span className="flex items-center gap-1"><Hash className="w-2.5 h-2.5" />{m.maxTokens}</span></div></button>))}</div>
          </motion.div></>)}</AnimatePresence>
        </div>
        <div className="flex-1" />
        <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Zap className="w-3 h-3" />{remainingRequests ?? rateLimit.maxRequestsPerHour} req/hr</span><Separator orientation="vertical" className="h-4" /><span className="font-mono">${CREDIT_PRICING.pricePerCredit}/credit</span></div>
      </div>
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 ? <WelcomeScreen /> : (
            <div className="space-y-6">{messages.map((msg, idx) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1"><Bot className="w-4 h-4 text-primary" /></div>}
                <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "order-first" : ""}`}>
                  {msg.role === "user" ? (<div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-br-md text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>) : (
                    <div className="bg-card border border-border/50 px-4 py-3 rounded-2xl rounded-bl-md">
                      {msg.content ? (<div className="text-sm leading-relaxed">{msg.content.split("```").map((block, i) => { if (i % 2 === 1) { const lines = block.split("\n"); const lang = lines[0]?.trim(); const code = lines.slice(1).join("\n").trim(); return (<div key={i} className="relative my-3 rounded-lg overflow-hidden"><div className="bg-[#1e1e2e] px-4 py-3 text-xs font-mono text-green-400 overflow-x-auto">{lang && <div className="text-muted-foreground mb-2 text-[10px]">{lang}</div>}<pre className="text-green-300 whitespace-pre">{code}</pre></div><button onClick={() => handleCopy(code, `c-${i}`)} className="absolute top-2 right-2 p-1.5 rounded bg-white/10 hover:bg-white/20 text-white/70 hover:text-white">{copiedId === `c-${i}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}</button></div>); } return block.split("\n").map((line, j) => { if (line.startsWith("# ")) return <h2 key={j} className="text-lg font-bold mt-4 mb-2">{line.slice(2)}</h2>; if (line.startsWith("## ")) return <h3 key={j} className="text-base font-semibold mt-3 mb-1">{line.slice(3)}</h3>; if (line.startsWith("- ") || line.startsWith("* ")) return <li key={j} className="ml-4 list-disc">{renderMd(line.slice(2))}</li>; if (/^\d+\.\s/.test(line)) return <li key={j} className="ml-4 list-decimal">{renderMd(line.replace(/^\d+\.\s/, ""))}</li>; if (line.trim() === "") return <br key={j} />; return <p key={j}>{renderMd(line)}</p>; }); })}</div>
                      ) : isStreaming && idx === messages.length - 1 ? (<div className="flex items-center gap-1.5 py-1">{[0, 0.2, 0.4].map((d, i) => (<motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d }} className="w-2 h-2 bg-primary rounded-full" />))}</div>) : null}
                      {msg.content && msg.role === "assistant" && idx === messages.length - 1 && !isStreaming && (<div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/30"><button onClick={() => handleCopy(msg.content, msg.id)} className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground">{copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}</button></div>)}
                    </div>
                  )}
                </div>
                {msg.role === "user" && <Avatar className="h-8 w-8 shrink-0 mt-1"><AvatarFallback className="text-xs font-medium bg-primary text-primary-foreground">{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback></Avatar>}
              </motion.div>
            ))}</div>
          )}
          {lastUsage && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 mb-2"><Card className="bg-card/50 border-border/30"><CardContent className="py-2.5 px-4"><div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"><span className="font-medium text-foreground flex items-center gap-1"><Brain className="w-3 h-3" />{lastUsage.model}</span>{lastUsage.demo && <Badge variant="outline" className="text-[10px] gap-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"><Info className="w-2.5 h-2.5" />Demo</Badge>}<span className="flex items-center gap-1"><ArrowUpRight className="w-2.5 h-2.5 text-green-500" />In: <span className="font-mono font-medium text-foreground">{lastUsage.inputTokens.toLocaleString()}</span></span><span className="flex items-center gap-1"><ArrowUpRight className="w-2.5 h-2.5 rotate-90 text-blue-500" />Out: <span className="font-mono font-medium text-foreground">{lastUsage.outputTokens.toLocaleString()}</span></span><span className="flex items-center gap-1"><Coins className="w-2.5 h-2.5 text-amber-500" />Cache: <span className="font-mono font-medium text-foreground">{lastUsage.cachedTokens?.toLocaleString() || 0}</span></span>{plan === "premium" && lastUsage.creditsUsed > 0 && (<><Separator orientation="vertical" className="h-3" /><span>-{lastUsage.creditsUsed.toFixed(2)} credits</span><span className="font-mono text-foreground">${lastUsage.costUsd.toFixed(4)}</span></>)}</div></CardContent></Card></motion.div>)}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="border-t border-border/50 bg-card/20 px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto"><div className="flex gap-2 items-end"><div className="flex-1"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask Example.Ai anything..." rows={1} className="w-full resize-none rounded-xl bg-background border border-border px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 min-h-[44px] max-h-[200px]" onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 200) + "px"; }} /></div><Button onClick={handleSend} disabled={!input.trim() || isStreaming} size="icon" className="h-11 w-11 rounded-xl shrink-0">{isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button></div><p className="text-[10px] text-center text-muted-foreground mt-2">Free models at $0.00/1M tokens • Verify important information</p></div>
      </div>
    </div>
  );
}

function WelcomeScreen() {
  const { setInput } = useAppStore();
  const suggestions = [{ icon: Code, title: "Write Code", desc: "Build a Python web scraper" }, { icon: Brain, title: "Explain Concepts", desc: "How does machine learning work?" }, { icon: Sparkles, title: "Creative Writing", desc: "Write a startup pitch deck" }, { icon: BarChart3, title: "Analyze Data", desc: "Explain this dataset trend" }];
  return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16"><div className="text-center mb-10"><div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><Bot className="w-8 h-8 text-primary" /></div><h1 className="text-3xl font-bold tracking-tight">Welcome to Example.Ai</h1><p className="text-muted-foreground mt-2 max-w-md mx-auto">Your AI assistant powered by NVIDIA NIM models.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">{suggestions.map((s, i) => (<motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => setInput(s.desc)} className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-accent hover:border-border text-left transition-all group"><div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20"><s.icon className="w-4 h-4 text-primary" /></div><div><p className="text-sm font-medium">{s.title}</p><p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p></div></motion.button>))}</div></motion.div>);
}

function UsageView() {
  const { user, setAuth } = useAppStore();
  const [usageData, setUsageData] = useState<any>(null);
  const [period, setPeriod] = useState("today");
  const plan = (user?.plan || "free") as "free" | "premium";
  const rl = RATE_LIMITS[plan];
  useEffect(() => { fetch(`/api/usage?period=${period}`).then((r) => r.json()).then(setUsageData).catch(() => {}); }, [period]);
  useEffect(() => { fetch("/api/user").then((r) => r.json()).then((d) => { if (d.user) setAuth(d.user); }).catch(() => {}); }, [setAuth]);
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold">Usage Analytics</h1><p className="text-sm text-muted-foreground mt-1">Monitor tokens, credits, spending</p></div><div className="flex gap-1 bg-accent rounded-lg p-1">{["today", "week", "month"].map((p) => (<button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-md text-xs font-medium ${period === p ? "bg-background shadow-sm" : "text-muted-foreground"}`}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>))}</div></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[{ t: "Input Tokens", v: usageData?.summary?.totalInputTokens?.toLocaleString() || "0", i: <ArrowUpRight className="w-4 h-4 text-green-500" />, d: "Tokens sent" }, { t: "Output Tokens", v: usageData?.summary?.totalOutputTokens?.toLocaleString() || "0", i: <ArrowUpRight className="w-4 h-4 text-blue-500 rotate-90" />, d: "Generated" }, { t: "Cached Tokens", v: usageData?.summary?.totalCachedTokens?.toLocaleString() || "0", i: <Coins className="w-4 h-4 text-amber-500" />, d: "Cache hits" }, { t: "Requests", v: usageData?.summary?.totalRequests?.toString() || "0", i: <BarChart3 className="w-4 h-4 text-purple-500" />, d: "API calls" }].map((s) => (<Card key={s.t} className="bg-card/50"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><span className="text-xs text-muted-foreground font-medium">{s.t}</span>{s.i}</div><p className="text-2xl font-bold">{s.v}</p><p className="text-[10px] text-muted-foreground mt-1">{s.d}</p></CardContent></Card>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" />Credits</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex items-baseline gap-2"><span className="text-3xl font-bold">{user?.credits?.toFixed(1) || "0"}</span><span className="text-sm text-muted-foreground">credits</span></div><Progress value={Math.min(100, ((user?.credits || 0) / CREDIT_PRICING.creditsPerPlan) * 100)} className="h-2" /><div className="flex justify-between text-xs text-muted-foreground"><span>${CREDIT_PRICING.pricePerCredit}/credit</span><span>${((user?.credits || 0) * CREDIT_PRICING.pricePerCredit).toFixed(2)} value</span></div></div></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Zap className="w-4 h-4" />Rate Limits ({plan === "premium" ? "Pro" : "Free"})</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-3 text-sm">{[["Req/hr", rl.maxRequestsPerHour], ["Req/day", rl.maxRequestsPerDay], ["Tokens/req", rl.maxTokensPerRequest.toLocaleString()], ["Tokens/day", rl.maxTokensPerDay.toLocaleString()]].map(([l, v]) => (<div key={l as string}><p className="text-muted-foreground text-xs">{l}</p><p className="font-semibold">{v}</p></div>))}</div></CardContent></Card>
      </div>
      {usageData?.chartData?.length > 0 && (<Card className="mb-6"><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Daily Usage</CardTitle></CardHeader><CardContent><div className="flex items-end gap-2 h-32">{usageData.chartData.map((d: any, i: number) => { const mx = Math.max(...usageData.chartData.map((x: any) => x.inputTokens + x.outputTokens), 1); const h = Math.max(4, ((d.inputTokens + d.outputTokens) / mx) * 100); return (<div key={i} className="flex-1 flex flex-col items-center gap-1"><span className="text-[10px] text-muted-foreground font-mono">{((d.inputTokens + d.outputTokens) / 1000).toFixed(1)}k</span><motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: i * 0.05 }} className="w-full bg-primary/20 rounded-t-md" /><span className="text-[10px] text-muted-foreground">{new Date(d.date).toLocaleDateString("en", { weekday: "short" }).slice(0, 3)}</span></div>); })}</div></CardContent></Card>)}
      <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Recent Activity</CardTitle></CardHeader><CardContent>{usageData?.records?.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">No usage yet</p> : (<div className="space-y-2">{usageData?.records?.slice(0, 10).map((r: any, i: number) => (<div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center"><Brain className="w-3.5 h-3.5 text-muted-foreground" /></div><div><p className="text-sm font-medium">{r.model}</p><p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p></div></div><div className="text-right text-xs"><span>In: {r.inputTokens?.toLocaleString()} | Out: {r.outputTokens?.toLocaleString()}</span>{r.creditsUsed > 0 && <p className="text-amber-600 dark:text-amber-400">-{r.creditsUsed.toFixed(2)} credits</p>}</div></div>))}</div>)}</CardContent></Card>
    </div>
  );
}

function PricingView() {
  const { user, setAuth } = useAppStore();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const handlePurchase = async (credits: number) => {
    setPurchasing("p"); setPaymentError("");
    try {
      // 1. Create Razorpay order on our server
      const r = await fetch("/api/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credits }) });
      const d = await r.json();
      if (!r.ok) { setPaymentError(d.error || "Payment setup failed"); setPurchasing(null); return; }

      // 2. Open Razorpay checkout (real payment gateway)
      // @ts-expect-error Razorpay loaded via script
      const rzp = new window.Razorpay({
        key: d.key,
        amount: d.amount,
        currency: d.currency,
        order_id: d.orderId,
        name: "Example.Ai",
        description: `${credits} Credits Purchase`,
        image: "/logo.svg",
        prefill: d.prefill || {},
        theme: { color: "#000000" },
        handler: async function (response: any) {
          // 3. Verify payment on server
          try {
            const vr = await fetch("/api/payment", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const vd = await vr.json();
            if (vd.success) {
              const u = await fetch("/api/user").then((r) => r.json());
              if (u.user) setAuth(u.user);
              setShowSuccess(true);
              setTimeout(() => setShowSuccess(false), 4000);
            } else {
              setPaymentError("Payment verification failed. Contact support.");
            }
          } catch { setPaymentError("Verification error. Contact support."); }
          setPurchasing(null);
        },
        modal: {
          ondismiss: function () { setPurchasing(null); setPaymentError(""); },
        },
      });
      rzp.on("payment.failed", async function (response: any) {
        setPaymentError("Payment failed: " + (response.error.description || "Unknown error"));
        setPurchasing(null);
        // Mark as failed
        await fetch("/api/payment", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: d.orderId, action: "fail" }) });
      });
      rzp.open();
    } catch (e) {
      setPaymentError("Could not open payment. Is Razorpay configured?");
      setPurchasing(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto overflow-y-auto h-full">
      <div className="text-center mb-8"><h1 className="text-3xl font-bold">Simple, Transparent Pricing</h1><p className="text-muted-foreground mt-2">Start free, scale as you grow. Payments via Razorpay.</p></div>
      <AnimatePresence>{showSuccess && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6"><Card className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"><CardContent className="py-4 flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /><div><p className="font-medium text-green-800 dark:text-green-300">Payment Successful! Credits added.</p><p className="text-sm text-green-600 dark:text-green-400">You now have Pro access.</p></div></CardContent></Card></motion.div>)}</AnimatePresence>
      {paymentError && <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800"><CardContent className="py-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /><p className="text-sm text-red-700 dark:text-red-300">{paymentError}</p></CardContent></Card>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {[{ id: "free", name: "Free", price: "₹0", period: "forever", desc: "Get started free", features: ["5 AI Models (Groq)", "30 req/hr", "100 req/day", "4K tokens/req", "Chat history"], disabled: user?.plan === "free", popular: false },
          { id: "premium", name: "Pro", price: "₹1,419", period: "/100 credits", desc: "For professionals", features: ["All 5 Models", "200 req/hr", "1K req/day", "8K tokens/req", "Unlimited history", "Priority support", "Custom API keys", "Advanced analytics"], disabled: user?.plan === "premium", popular: true }
        ].map((p) => (<motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><Card className={`relative h-full ${p.popular ? "border-primary shadow-lg shadow-primary/5" : ""}`}>{p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="bg-primary text-primary-foreground px-3 py-0.5"><Sparkles className="w-3 h-3 mr-1" />Popular</Badge></div>}<CardHeader className="text-center pb-2 pt-6"><CardTitle className="text-xl">{p.name}</CardTitle><CardDescription>{p.desc}</CardDescription><div className="mt-4"><span className="text-4xl font-bold">{p.price}</span><span className="text-muted-foreground text-sm">{p.period}</span></div></CardHeader><CardContent className="space-y-4"><Button className="w-full" variant={p.popular ? "default" : "outline"} disabled={p.disabled || !!purchasing} onClick={() => p.id === "premium" && handlePurchase(CREDIT_PRICING.creditsPerPlan)}>{purchasing ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Opening Razorpay...</> : <>{p.disabled && <CheckCircle2 className="w-4 h-4 mr-2" />}{p.disabled ? "Current Plan" : p.id === "premium" ? "Pay with Razorpay" : "Free"}</>}</Button><Separator /><ul className="space-y-2.5">{p.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{f}</li>)}</ul></CardContent></Card></motion.div>))}
      </div>
      <div className="mt-10 max-w-3xl mx-auto"><h2 className="text-xl font-bold text-center mb-4">Buy Credits</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[10, 25, 50, 100].map((c) => (<motion.div key={c} whileHover={{ scale: 1.02 }}><Card className="cursor-pointer hover:border-primary/50 text-center"><CardContent className="py-4"><p className="text-2xl font-bold">{c}</p><p className="text-xs text-muted-foreground">credits</p><p className="text-lg font-semibold mt-1">₹{(c * CREDIT_PRICING.pricePerCredit * 83.5).toFixed(0)}</p><p className="text-[10px] text-muted-foreground">≈${(c * CREDIT_PRICING.pricePerCredit).toFixed(2)}</p><Button size="sm" variant="outline" className="mt-2 w-full" disabled={!!purchasing} onClick={() => handlePurchase(c)}>{purchasing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Buy"}</Button></CardContent></Card></motion.div>))}</div></div>
      <div className="mt-10 max-w-2xl mx-auto"><h2 className="text-xl font-bold text-center mb-6">FAQ</h2><div className="space-y-4">{[{ q: "How do payments work?", a: "We use Razorpay (India's leading payment gateway). All transactions are secure and encrypted." }, { q: "What currency?", a: "Payments are in INR (Indian Rupees). 1 credit = ₹14.19 (≈$0.17)." }, { q: "Can I get a refund?", a: "Contact support within 24 hours for refund requests." }, { q: "Use my own API key?", a: "Yes! Add your free Groq API key in Settings for unlimited free AI." }].map((f, i) => <Card key={i}><CardContent className="py-4"><p className="font-medium text-sm">{f.q}</p><p className="text-sm text-muted-foreground mt-1">{f.a}</p></CardContent></Card>)}</div></div>
    </div>
  );
}

function SettingsView() {
  const { user, setAuth } = useAppStore();
  const [groqKey, setGroqKey] = useState("");
  const [nvidiaKey, setNvidiaKey] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  useEffect(() => { fetch("/api/user").then((r) => r.json()).then((d) => { if (d.user) { setAuth(d.user); setName(d.user.name || ""); if (d.user.apiKeys) try { const k = JSON.parse(d.user.apiKeys); if (k.groq) setGroqKey(k.groq); if (k.nvidia) setNvidiaKey(k.nvidia); } catch {} } }).catch(() => {}); }, [setAuth]);
  const handleSave = async () => { setSaving(true); try { const ak: Record<string, string> = {}; if (groqKey.trim()) ak.groq = groqKey.trim(); if (nvidiaKey.trim()) ak.nvidia = nvidiaKey.trim(); const r = await fetch("/api/user", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, apiKeys: ak }) }); const d = await r.json(); if (d.user) { setAuth(d.user); setSaved(true); setTimeout(() => setSaved(false), 2000); } } catch {} finally { setSaving(false); } };
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto overflow-y-auto h-full">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <Card><CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader><CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1.5 block">Name</label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="text-sm font-medium mb-1.5 block">Email</label><Input value={user?.email || ""} disabled className="bg-muted" /></div>
          <div><label className="text-sm font-medium mb-1.5 block">Plan</label><div className="flex items-center gap-2"><Badge variant={user?.plan === "premium" ? "default" : "secondary"} className={user?.plan === "premium" ? "bg-amber-500 text-white" : ""}>{user?.plan === "premium" ? "Pro" : "Free"}</Badge>{user?.plan === "free" && <button onClick={() => useAppStore.getState().setActiveView("pricing")} className="text-xs text-primary hover:underline">Upgrade</button>}</div></div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Code className="w-4 h-4" />API Keys</CardTitle><CardDescription>Connect your own provider keys</CardDescription></CardHeader><CardContent className="space-y-4">
          <div><label className="text-sm font-medium mb-1.5 flex items-center gap-2">Groq API Key <Badge variant="outline" className="text-[10px]">Primary • Free</Badge></label><Input type="password" value={groqKey} onChange={(e) => setGroqKey(e.target.value)} placeholder="gsk_..." /><p className="text-xs text-muted-foreground mt-1.5">Get at <a href="https://console.groq.com/keys" target="_blank" className="text-primary hover:underline">console.groq.com</a> — No credit card, instant access</p></div>
          <div><label className="text-sm font-medium mb-1.5 flex items-center gap-2">NVIDIA NIM API Key <Badge variant="outline" className="text-[10px]">Optional</Badge></label><Input type="password" value={nvidiaKey} onChange={(e) => setNvidiaKey(e.target.value)} placeholder="nvapi-..." /><p className="text-xs text-muted-foreground mt-1.5">Get at <a href="https://build.nvidia.com" target="_blank" className="text-primary hover:underline">build.nvidia.com</a></p></div>
          <div className="flex items-center gap-2"><Button onClick={handleSave} disabled={saving}>{saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : "Save"}</Button>{saved && <span className="text-sm text-green-600">Saved!</span>}</div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><Coins className="w-4 h-4" />Pricing Table</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-2">Model</th><th className="text-right py-2">In/1M</th><th className="text-right py-2">Out/1M</th><th className="text-right py-2">Cache/1M</th></tr></thead><tbody>{AI_MODELS.map((m) => (<tr key={m.id} className="border-b border-border/30"><td className="py-2"><p className="font-medium">{m.name}</p></td><td className="text-right py-2 font-mono text-green-600">${m.inputPricePerM.toFixed(2)}</td><td className="text-right py-2 font-mono text-blue-600">${m.outputPricePerM.toFixed(2)}</td><td className="text-right py-2 font-mono text-amber-600">${m.cachePricePerM.toFixed(2)}</td></tr>))}</tbody></table></div></CardContent></Card>
        <Card className="border-destructive/30"><CardHeader><CardTitle className="text-base text-destructive">Danger Zone</CardTitle></CardHeader><CardContent><Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/30" onClick={() => signOut({ callbackUrl: "/" })}><LogOut className="w-4 h-4 mr-2" />Sign Out</Button></CardContent></Card>
      </div>
    </div>
  );
}
