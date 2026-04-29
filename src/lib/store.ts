import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  inputTokens?: number;
  outputTokens?: number;
  cachedTokens?: number;
  model?: string;
  timestamp?: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  model: string;
  messageCount: number;
  lastMessage?: string;
  updatedAt: string;
}

export interface UsageInfo {
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  creditsUsed: number;
  costUsd: number;
  model?: string;
  remainingCredits?: number | null;
  remainingRequests?: number | null;
  demo?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  credits: number;
  totalSpent: number;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: UserProfile | null;
  setAuth: (user: UserProfile | null) => void;

  // Chat
  currentSessionId: string | null;
  currentModel: string;
  messages: Message[];
  isStreaming: boolean;
  lastUsage: UsageInfo | null;
  sidebarOpen: boolean;
  activeView: "chat" | "usage" | "pricing" | "settings";

  setCurrentSessionId: (id: string | null) => void;
  setCurrentModel: (model: string) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setMessages: (messages: Message[]) => void;
  setIsStreaming: (streaming: boolean) => void;
  setLastUsage: (usage: UsageInfo | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: "chat" | "usage" | "pricing" | "settings") => void;
  clearChat: () => void;

  // Sessions
  sessions: ChatSession[];
  setSessions: (sessions: ChatSession[]) => void;
  addSession: (session: ChatSession) => void;
  removeSession: (id: string) => void;

  // Input (for welcome screen suggestions)
  input: string;
  setInput: (input: string) => void;

  // Rate limiting
  remainingRequests: number | null;
  setRemainingRequests: (remaining: number | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Auth
      isAuthenticated: false,
      user: null,
      setAuth: (user) => set({ isAuthenticated: !!user, user }),

      // Chat
      currentSessionId: null,
      currentModel: "nvidia/llama-3.1-8b-instruct",
      messages: [],
      isStreaming: false,
      lastUsage: null,
      sidebarOpen: true,
      activeView: "chat",

      setCurrentSessionId: (id) => set({ currentSessionId: id }),
      setCurrentModel: (model) => set({ currentModel: model }),
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      updateLastMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          const lastMsg = messages[messages.length - 1];
          if (lastMsg && lastMsg.role === "assistant") {
            messages[messages.length - 1] = { ...lastMsg, content: lastMsg.content + content };
          }
          return { messages };
        }),
      setMessages: (messages) => set({ messages }),
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),
      setLastUsage: (usage) => set({ lastUsage: usage }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveView: (view) => set({ activeView: view }),
      clearChat: () => set({ messages: [], currentSessionId: null, lastUsage: null }),

      // Sessions
      sessions: [],
      setSessions: (sessions) => set({ sessions }),
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      removeSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),

      // Input
      input: "",
      setInput: (input) => set({ input }),

      // Rate limiting
      remainingRequests: null,
      setRemainingRequests: (remaining) => set({ remainingRequests: remaining }),
    }),
    {
      name: "example-ai-store",
      partialize: (state) => ({
        currentModel: state.currentModel,
        sidebarOpen: state.sidebarOpen,
        activeView: state.activeView,
      }),
    }
  )
);
