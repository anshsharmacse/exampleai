export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  inputPricePerM: number;
  outputPricePerM: number;
  cachePricePerM: number;
  maxTokens: number;
  free: boolean;
  contextWindow: string;
  groqModelId: string;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "meta/llama-3.1-8b-instruct",
    name: "Llama 3.1 8B",
    provider: "Groq",
    description: "Ultra-fast responses. Best for quick tasks and casual conversations.",
    inputPricePerM: 0.0,
    outputPricePerM: 0.0,
    cachePricePerM: 0.0,
    maxTokens: 8192,
    free: true,
    contextWindow: "128K",
    groqModelId: "llama-3.1-8b-instant",
  },
  {
    id: "meta/llama-3.1-70b-instruct",
    name: "Llama 3.1 70B",
    provider: "Groq",
    description: "High-quality reasoning for complex tasks, coding, and analysis.",
    inputPricePerM: 0.0,
    outputPricePerM: 0.0,
    cachePricePerM: 0.0,
    maxTokens: 8192,
    free: true,
    contextWindow: "128K",
    groqModelId: "llama-3.1-70b-versatile",
  },
  {
    id: "mistralai/mixtral-8x22b-instruct-v0.1",
    name: "Mixtral 8x7B",
    provider: "Groq",
    description: "Mixture of experts. Great for code, multilingual, and structured output.",
    inputPricePerM: 0.0,
    outputPricePerM: 0.0,
    cachePricePerM: 0.0,
    maxTokens: 8192,
    free: true,
    contextWindow: "32K",
    groqModelId: "mixtral-8x7b-32768",
  },
  {
    id: "google/gemma-2-9b-it",
    name: "Gemma 2 9B",
    provider: "Groq",
    description: "Google's lightweight model. Fast with excellent instruction following.",
    inputPricePerM: 0.0,
    outputPricePerM: 0.0,
    cachePricePerM: 0.0,
    maxTokens: 8192,
    free: true,
    contextWindow: "8K",
    groqModelId: "gemma2-9b-it",
  },
  {
    id: "nvidia/llama-3.1-nemotron-70b-instruct",
    name: "Llama 3.3 70B",
    provider: "Groq",
    description: "Latest Llama 3.3 with improved reasoning and instruction following.",
    inputPricePerM: 0.0,
    outputPricePerM: 0.0,
    cachePricePerM: 0.0,
    maxTokens: 8192,
    free: true,
    contextWindow: "128K",
    groqModelId: "llama-3.3-70b-versatile",
  },
];

export const RATE_LIMITS = {
  free: {
    maxTokensPerDay: 50000,
    maxTokensPerRequest: 4096,
    maxRequestsPerHour: 30,
    maxRequestsPerDay: 100,
    creditsPerRequest: 0,
  },
  premium: {
    maxTokensPerDay: 500000,
    maxTokensPerRequest: 8192,
    maxRequestsPerHour: 200,
    maxRequestsPerDay: 1000,
    creditsPerRequest: 0.17,
  },
};

export const CREDIT_PRICING = {
  pricePerCredit: 0.17,
  creditsPerPlan: 100,
  planPrice: 17.00,
  creditsPerRequest: 0.17,
};
