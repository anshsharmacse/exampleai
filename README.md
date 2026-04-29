<div align="center">

# Example.Ai

**Production-Ready Next.js 16 AI Chatbot Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com/)
[![Groq](https://img.shields.io/badge/AI-Groq-F55036?style=flat-square)](https://groq.com/)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Chat System Flow](#chat-system-flow)
- [API Routes Map](#api-routes-map)
- [Payment Flow](#payment-flow)
- [Rate Limiting and Credit System](#rate-limiting-and-credit-system)
- [Deployment Architecture](#deployment-architecture)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Dashboard](#performance-dashboard)
- [How to Scale It Up](#how-to-scale-it-up)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Author](#author)
- [License](#license)

---

## Overview

**Example.Ai** is a production-grade, full-stack AI chatbot platform built with Next.js 16 App Router, featuring real-time streaming responses powered by the Groq API, Razorpay payment integration, a comprehensive credit-based usage system, and a polished UI built with shadcn/ui and Tailwind CSS 4. It supports multiple AI models, persistent chat sessions, and user authentication via NextAuth.js v4.

The platform is designed with scalability in mind -- from serverless deployment on Vercel Edge Functions to database connection pooling with Supabase, and a modular architecture that can evolve toward microservices as traffic grows.

> **Note:** This project is self-contained and can be deployed end-to-end with a single `vercel deploy` command after configuring environment variables. No external infrastructure beyond Supabase, Groq, and Razorpay accounts is required.

---

## Features

| Category | Features |
|----------|----------|
| **Authentication** | Email/password registration, NextAuth.js v4 session management, JWT tokens, protected routes |
| **Chat System** | Multi-model AI chat, real-time SSE streaming, persistent chat sessions, markdown rendering, code syntax highlighting |
| **AI Models** | Groq LPU inference (Llama 3.1, Mixtral, Gemma 2), model switching per session, token tracking |
| **Payments** | Razorpay checkout integration, credit-based billing, payment verification webhook, transaction history |
| **Usage Tracking** | Per-message token counting (input/output/cached), cost estimation in USD, usage dashboard |
| **UI/UX** | Dark/light theme, responsive design, shadcn/ui components, sidebar navigation, markdown editor |
| **State Management** | Zustand global store, React Query for server state, optimistic updates |
| **Database** | PostgreSQL via Supabase, Prisma ORM, relational schema with cascade deletes |
| **DevOps** | Docker support, Vercel auto-deploy, health checks, structured logging |
| **Internationalization** | next-intl for multi-language support |
| **Drag and Drop** | @dnd-kit for sortable chat sessions and resizable panels |

---

## Tech Stack

### Technology Table

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.x | Full-stack React framework with App Router |
| UI Library | React | 19.x | Component-based UI |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Components | shadcn/ui | latest | Accessible UI primitives (Radix UI) |
| ORM | Prisma | 6.x | Type-safe database client |
| Database | Supabase PostgreSQL | - | Managed PostgreSQL |
| Authentication | NextAuth.js | 4.x | Session management |
| AI Provider | Groq API | - | LPU inference engine |
| Payments | Razorpay | 2.x | Payment processing |
| State | Zustand | 5.x | Client-side state management |
| Server State | React Query | 5.x | Data fetching and caching |
| Validation | Zod | 4.x | Schema validation |
| Forms | React Hook Form | 7.x | Form state management |
| Animations | Framer Motion | 12.x | UI animations |
| Icons | Lucide React | latest | Icon library |
| Markdown | react-markdown | 10.x | Markdown rendering |
| i18n | next-intl | 4.x | Internationalization |

### Tech Stack Mindmap

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
mindmap
  root((Example.Ai))
    Frontend
      Next.js 16 App Router
      React 19
      TypeScript 5
      Tailwind CSS 4
      shadcn/ui
      Framer Motion
      Lucide Icons
      next-intl i18n
    Backend
      API Route Handlers
      NextAuth.js v4
      Server Actions
      Edge Functions
      SSE Streaming
      Razorpay Webhooks
    Data Layer
      Prisma ORM 6
      Supabase PostgreSQL
      Zod Validation
      React Query 5
      Zustand 5
    AI Engine
      Groq LPU Inference
      Llama 3.1 8B
      Mixtral 8x7B
      Gemma 2 9B
      Token Tracking
    Payments
      Razorpay Checkout
      Credit System
      Payment Verification
      Transaction History
    DevOps
      Vercel Deployment
      Docker Support
      GitHub Actions CI
      Health Checks
      Structured Logging
```

---

## Architecture Overview

The following diagram illustrates the complete system architecture of Example.Ai, showing how each component interacts with the others.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TB
    subgraph Client ["Client Layer"]
        Browser["Browser / PWA"]
        UI["React 19 + shadcn/ui"]
        State["Zustand Store"]
        RQ["React Query Cache"]
    end

    subgraph NextJS ["Next.js 16 App Router"]
        Pages["App Router Pages"]
        SSR["Server Components"]
        RSC["React Server Components"]
        API["API Route Handlers"]
        Middleware["Middleware Auth Guard"]
    end

    subgraph Services ["Service Layer"]
        Auth["NextAuth.js v4"]
        ChatEngine["Chat Engine"]
        PayService["Payment Service"]
        UsageService["Usage Tracker"]
    end

    subgraph External ["External Services"]
        Groq["Groq AI API"]
        Razorpay["Razorpay Gateway"]
    end

    subgraph Data ["Data Layer"]
        Prisma["Prisma ORM"]
        PG["Supabase PostgreSQL"]
    end

    Browser --> UI
    Browser --> State
    UI --> RQ
    State --> API
    RQ --> API
    Pages --> SSR
    Pages --> RSC
    SSR --> API
    API --> Auth
    API --> ChatEngine
    API --> PayService
    API --> UsageService
    ChatEngine -->|SSE Stream| Groq
    PayService -->|Create/Verify| Razorpay
    Auth --> Prisma
    ChatEngine --> Prisma
    PayService --> Prisma
    UsageService --> Prisma
    Prisma --> PG
    Middleware --> Auth
    Auth -->|JWT| Browser

    style Client fill:#f0fdf4,stroke:#10b981,stroke-width:2px
    style NextJS fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Services fill:#fce7f3,stroke:#ec4899,stroke-width:2px
    style External fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Data fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
```

---

## Database Schema

The database uses five interconnected models managed by Prisma ORM on Supabase PostgreSQL. All relationships use cascade deletes to maintain data integrity.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
erDiagram
    User {
        String id PK "cuid()"
        String email UK "unique"
        String name "nullable"
        String password "nullable (hashed)"
        String image "nullable"
        String plan "default: free"
        Float credits "default: 0"
        Float totalSpent "default: 0"
        String apiKeys "nullable JSON"
        DateTime createdAt "now()"
        DateTime updatedAt "auto"
    }

    ChatSession {
        String id PK "cuid()"
        String userId FK "cascade"
        String title "default: New Chat"
        String model "default: llama-3.1-8b"
        DateTime createdAt "now()"
        DateTime updatedAt "auto"
    }

    Message {
        String id PK "cuid()"
        String sessionId FK "cascade"
        String role "user/assistant/system"
        String content "text"
        Int inputTokens "default: 0"
        Int outputTokens "default: 0"
        Int cachedTokens "default: 0"
        String model "nullable"
        DateTime createdAt "now()"
    }

    UsageRecord {
        String id PK "cuid()"
        String userId FK "cascade"
        Int inputTokens "default: 0"
        Int outputTokens "default: 0"
        Int cachedTokens "default: 0"
        Float creditsUsed "default: 0"
        Float costUsd "default: 0"
        String model ""
        DateTime createdAt "now()"
    }

    Payment {
        String id PK "cuid()"
        String userId FK "cascade"
        String razorpayOrderId "nullable"
        String razorpayPaymentId "nullable"
        Float amount "USD"
        Float creditsAdded ""
        String status "pending/completed/failed"
        DateTime createdAt "now()"
    }

    User ||--o{ ChatSession : "has many"
    User ||--o{ UsageRecord : "has many"
    User ||--o{ Payment : "has many"
    ChatSession ||--o{ Message : "has many"
```

### Schema Highlights

| Model | Primary Key | Foreign Key | Cascade Delete | Unique Constraint |
|-------|-----------|-------------|----------------|-------------------|
| User | `id` (cuid) | -- | -- | `email` |
| ChatSession | `id` (cuid) | `userId` | Yes | -- |
| Message | `id` (cuid) | `sessionId` | Yes | -- |
| UsageRecord | `id` (cuid) | `userId` | Yes | -- |
| Payment | `id` (cuid) | `userId` | Yes | -- |

---

## Authentication Flow

The authentication system uses NextAuth.js v4 with a Credentials provider. Passwords are hashed with bcryptjs before storage. Sessions are managed via JWT tokens stored in HTTP-only cookies.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant NextAuth as NextAuth API
    participant DB as Supabase PostgreSQL
    participant Middleware as Middleware Guard

    Note over User,Middleware: Registration Flow
    User->>Browser: Fill signup form
    Browser->>NextAuth: POST /api/auth/register
    NextAuth->>NextAuth: Validate with Zod schema
    NextAuth->>NextAuth: Hash password (bcryptjs)
    NextAuth->>DB: Prisma.user.create()
    DB-->>NextAuth: User record created
    NextAuth-->>Browser: 201 - User registered

    Note over User,Middleware: Login Flow
    User->>Browser: Fill login form
    Browser->>NextAuth: POST /api/auth/callback/credentials
    NextAuth->>DB: Prisma.user.findUnique(email)
    DB-->>NextAuth: User record
    NextAuth->>NextAuth: Compare password (bcryptjs)
    alt Valid credentials
        NextAuth->>NextAuth: Generate JWT token
        NextAuth->>NextAuth: Encode user id, email, plan
        NextAuth-->>Browser: Set-Cookie: next-auth.session-token
        Browser-->>User: Redirect to dashboard
    else Invalid credentials
        NextAuth-->>Browser: 401 - Unauthorized
        Browser-->>User: Show error message
    end

    Note over User,Middleware: Protected Route Access
    User->>Browser: Navigate to /dashboard
    Browser->>Middleware: GET /dashboard
    Middleware->>NextAuth: Verify JWT token
    NextAuth-->>Middleware: Token valid, decode payload
    Middleware->>DB: Prisma.user.findUnique(id)
    DB-->>Middleware: Current user data
    Middleware-->>Browser: Allow access (inject session)
    Browser-->>User: Render dashboard
```

> **Important:** The middleware guard intercepts all requests to protected routes. Unauthenticated users are redirected to `/login` with a `callbackUrl` query parameter for post-login redirection.

---

## Chat System Flow

The chat system uses Server-Sent Events (SSE) for real-time streaming of AI responses. Messages are persisted to the database after each interaction.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
sequenceDiagram
    autonumber
    actor User
    participant UI as React UI
    participant Store as Zustand Store
    participant API as /api/chat
    participant DB as PostgreSQL
    participant Groq as Groq API

    User->>UI: Type message and send
    UI->>Store: Add optimistic user message
    UI->>Store: Set streaming = true
    UI->>API: POST /api/chat SSE stream

    API->>API: Verify JWT session
    API->>API: Check rate limits and credits
    API->>DB: Save user message to Message table
    API->>DB: Fetch conversation history

    API->>Groq: POST /v1/chat/completions stream:true
    activate Groq

    loop For each token chunk
        Groq-->>API: SSE data chunk
        API-->>UI: SSE event with token
        UI->>Store: Append token to assistant message
        UI->>User: Render token incrementally
    end

    Groq-->>API: SSE [DONE]
    deactivate Groq

    API->>API: Calculate token usage
    API->>DB: Save assistant message to Message table
    API->>DB: Create UsageRecord entry
    API->>DB: Deduct credits from User
    API-->>UI: SSE event with metadata

    UI->>Store: Set streaming = false
    UI->>Store: Update session title if first message
    UI->>User: Show complete response
```

### SSE Event Format

The streaming API emits the following event types:

| Event | Data | Description |
|-------|------|-------------|
| `token` | `{ content: string }` | Individual text token from the model |
| `usage` | `{ inputTokens, outputTokens, cachedTokens }` | Token usage for the message |
| `done` | `{ messageId, totalTokens }` | Stream completion with message ID |
| `error` | `{ code, message }` | Error during streaming |

---

## API Routes Map

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart LR
    subgraph AuthRoutes ["Authentication /api/auth"]
        A1["POST /register"]
        A2["GET,POST /callback/credentials"]
        A3["POST /signin"]
        A4["POST /signout"]
        A5["GET /session"]
    end

    subgraph ChatRoutes ["Chat /api"]
        C1["POST /chat"]
        C2["GET /sessions"]
        C3["POST /sessions"]
        C4["DELETE /sessions/:id"]
        C5["GET /sessions/:id/messages"]
    end

    subgraph UserRoutes ["User /api"]
        U1["GET /user"]
        U2["PUT /user"]
        U3["DELETE /user"]
        U4["GET /models"]
    end

    subgraph BillingRoutes ["Billing /api"]
        B1["GET /usage"]
        B2["GET /payment"]
        B3["POST /payment/create-order"]
        B4["POST /payment/verify"]
        B5["GET /credits"]
    end

    Client["Client App"] --> AuthRoutes
    Client --> ChatRoutes
    Client --> UserRoutes
    Client --> BillingRoutes

    style AuthRoutes fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style ChatRoutes fill:#fce7f3,stroke:#ec4899,stroke-width:2px
    style UserRoutes fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style BillingRoutes fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
```

### API Routes Detail

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/[...nextauth]` | No | NextAuth handlers |
| POST | `/api/chat` | Yes | Send message, receive SSE stream |
| GET | `/api/sessions` | Yes | List all chat sessions |
| POST | `/api/sessions` | Yes | Create new chat session |
| DELETE | `/api/sessions` | Yes | Delete a chat session |
| GET | `/api/user` | Yes | Get current user profile |
| PUT | `/api/user` | Yes | Update user profile |
| GET | `/api/usage` | Yes | Get usage records and stats |
| POST | `/api/payment` | Yes | Create Razorpay order |
| POST | `/api/payment/verify` | Yes | Verify payment and add credits |
| GET | `/api/credits` | Yes | Get current credit balance |
| GET | `/api/models` | Yes | List available AI models |

---

## Payment Flow

The payment system integrates with Razorpay to provide a seamless credit purchase experience. Payments are verified server-side to prevent tampering.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    Start["User clicks Buy Credits"] --> SelectPlan["Select credit plan"]
    SelectPlan --> API["POST /api/payment"]
    API --> Validate["Validate user session"]
    Validate -->|Invalid| Error401["Return 401 Unauthorized"]
    Validate -->|Valid| CreateOrder["Create Razorpay Order"]
    CreateOrder --> RZP["Razorpay API: POST /orders"]
    RZP --> OrderID["Receive razorpayOrderId"]
    OrderID --> DBPending["Save Payment record (status: pending)"]
    DBPending --> ReturnKey["Return order_id + key to client"]

    ReturnKey --> OpenCheckout["Open Razorpay Checkout modal"]
    OpenCheckout --> UserPay["User enters payment details"]
    UserPay --> Process["Razorpay processes payment"]

    Process -->|Success| VerifySig["POST /api/payment/verify"]
    Process -->|Failure| FailUpdate["Update Payment status: failed"]
    FailUpdate --> ShowError["Show payment failed message"]

    VerifySig --> ServerVerify["Server: Verify signature using secret"]
    ServerVerify -->|Invalid| RejectPay["Reject - Return 400 Bad Request"]
    ServerVerify -->|Valid| UpdateDB["Update Payment status: completed"]
    UpdateDB --> AddCredits["Add credits to User.credits"]
    AddCredits --> LogUsage["Create UsageRecord for purchase"]
    LogUsage --> Success["Return success + new balance"]
    Success --> ShowConfirm["Show confirmation to user"]

    style Start fill:#10b981,stroke:#059669,color:#fff
    style Success fill:#10b981,stroke:#059669,color:#fff
    style ShowConfirm fill:#10b981,stroke:#059669,color:#fff
    style Error401 fill:#ef4444,stroke:#dc2626,color:#fff
    style RejectPay fill:#ef4444,stroke:#dc2626,color:#fff
    style FailUpdate fill:#f59e0b,stroke:#d97706,color:#fff
    style ShowError fill:#f59e0b,stroke:#d97706,color:#fff
```

### Credit Plans (Example)

| Plan | Price (USD) | Credits | Bonus |
|------|------------|---------|-------|
| Starter | $5.00 | 500 | -- |
| Pro | $15.00 | 2,000 | +200 bonus |
| Enterprise | $50.00 | 10,000 | +2,000 bonus |

---

## Rate Limiting and Credit System

The platform enforces differentiated rate limits based on user plan. Free users have stricter limits to prevent abuse, while premium users get higher throughput based on their credit balance.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    Request["Incoming API Request"] --> AuthCheck{"Is authenticated?"}
    AuthCheck -->|No| Reject["401 Unauthorized"]
    AuthCheck -->|Yes| GetPlan{"User.plan?"}

    GetPlan -->|free| FreeCheck{"Within daily limit?"}
    GetPlan -->|premium| CreditCheck{"Has credits?"}

    FreeCheck -->|Yes| FreeQuota{"Messages &lt; 20/day?"}
    FreeCheck -->|No| RateLimit{"429 Rate Limited"}

    FreeQuota -->|Yes| ProcessFree["Process with rate delay"]
    FreeQuota -->|No| QuotaExceeded{"429 Daily Quota Exceeded"}

    ProcessFree --> LogUsage1["Log usage (no charge)"]
    CreditCheck -->|No| NoCredits{"402 Payment Required"}
    CreditCheck -->|Yes| EstimateCost["Estimate token cost"]

    EstimateCost --> CanAfford{"Credits >= cost?"}
    CanAfford -->|No| Insufficient{"402 Insufficient Credits"}
    CanAfford -->|Yes| ProcessPremium["Process immediately"]
    ProcessPremium --> DeductCredits["Deduct credits from balance"]
    DeductCredits --> LogUsage2["Log usage with cost"]

    LogUsage1 --> Respond["Stream AI response"]
    LogUsage2 --> Respond

    style Reject fill:#ef4444,stroke:#dc2626,color:#fff
    style RateLimit fill:#ef4444,stroke:#dc2626,color:#fff
    style QuotaExceeded fill:#ef4444,stroke:#dc2626,color:#fff
    style NoCredits fill:#f59e0b,stroke:#d97706,color:#fff
    style Insufficient fill:#f59e0b,stroke:#d97706,color:#fff
    style ProcessFree fill:#10b981,stroke:#059669,color:#fff
    style ProcessPremium fill:#10b981,stroke:#059669,color:#fff
    style Respond fill:#10b981,stroke:#059669,color:#fff
```

### Rate Limit Comparison

| Attribute | Free Plan | Premium Plan |
|-----------|-----------|--------------|
| Daily messages | 20 | Unlimited |
| Requests per minute | 5 | 30 |
| Max tokens per request | 2,048 | 8,192 |
| Available models | 1 (Llama 3.1 8B) | All models |
| Response priority | Standard | High |
| Cost per message | $0.00 (ad-supported) | Credit-based |

---

## Deployment Architecture

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TB
    subgraph Source ["Source Control"]
        GitHub["GitHub Repository"]
        Actions["GitHub Actions CI"]
    end

    subgraph CDN ["Content Delivery"]
        VercelCDN["Vercel Edge Network"]
        StaticAssets["Static Assets CDN"]
        Cache["Edge Cache"]
    end

    subgraph Compute ["Compute Layer"]
        EdgeFn["Edge Functions SSR"]
        Serverless["Serverless API Functions"]
        ISR["ISR Pages"]
    end

    subgraph DataServices ["Data Services"]
        SupabaseDB["Supabase PostgreSQL"]
        ConnectionPool["PgBouncer Connection Pool"]
    end

    subgraph AIServices ["AI Services"]
        GroqAPI["Groq LPU Inference"]
        ModelRouter["Model Router"]
    end

    subgraph Payments ["Payment Services"]
        RazorpayGW["Razorpay Gateway"]
        Webhook["Webhook Handler"]
    end

    subgraph Monitoring ["Observability"]
        VercelLogs["Vercel Logs"]
        Analytics["Vercel Analytics"]
        SpeedInsights["Speed Insights"]
    end

    subgraph Regions ["Global Regions"]
        US["US East"]
        EU["EU West"]
        Asia["Asia Pacific"]
    end

    GitHub -->|push| Actions
    Actions -->|deploy| VercelCDN
    VercelCDN --> EdgeFn
    VercelCDN --> StaticAssets
    VercelCDN --> Cache
    EdgeFn --> Serverless
    EdgeFn --> ISR
    Serverless --> ConnectionPool
    ConnectionPool --> SupabaseDB
    Serverless --> GroqAPI
    GroqAPI --> ModelRouter
    Serverless --> RazorpayGW
    RazorpayGW --> Webhook
    Webhook --> Serverless
    Serverless --> VercelLogs
    VercelCDN --> Analytics
    VercelCDN --> SpeedInsights
    VercelCDN --> US
    VercelCDN --> EU
    VercelCDN --> Asia

    style Source fill:#f0fdf4,stroke:#10b981,stroke-width:2px
    style CDN fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Compute fill:#fce7f3,stroke:#ec4899,stroke-width:2px
    style DataServices fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style AIServices fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Payments fill:#fef2f2,stroke:#ef4444,stroke-width:2px
    style Monitoring fill:#f8f9fa,stroke:#6b7280,stroke-width:2px
    style Regions fill:#f0fdf4,stroke:#10b981,stroke-width:1px
```

> **Note:** Vercel Edge Functions are deployed to 30+ global locations. Static assets are cached at the edge with automatic cache invalidation on each deployment. The Supabase connection uses PgBouncer for efficient connection pooling, supporting up to 100 concurrent connections on the free tier.

---

## CI/CD Pipeline

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    Push["Developer: git push"] --> GitHub["GitHub receives push"]
    GitHub --> Branch{"Branch?"}

    Branch -->|main| StartCI["Start CI Pipeline"]
    Branch -->|feature/*| PRCheck["Run PR checks"]
    Branch -->|hotfix/*| StartCI

    subgraph CI ["Continuous Integration"]
        StartCI --> Install["Install dependencies"]
        Install --> Lint["ESLint check"]
        Lint --> TypeCheck["TypeScript type check"]
        TypeCheck --> Build["Next.js build"]
        Build --> TestBuild["Verify build output"]
    end

    TestBuild -->|Pass| Deploy["Deploy to Vercel"]
    TestBuild -->|Fail| Notify["Notify developer"]
    Notify --> Fix["Fix and re-push"]

    subgraph CD ["Continuous Deployment"]
        Deploy --> Preview{"Preview or Production?"}
        Preview -->|Pull Request| PreviewURL["Deploy preview URL"]
        Preview -->|main branch| ProdDeploy["Deploy to production"]
        ProdDeploy --> Alias["Update DNS alias"]
        Alias --> Propagate["CDN cache propagation"]
        Propagate --> HealthCheck["Health check endpoint"]
        HealthCheck -->|Healthy| Live["Deployment live"]
        HealthCheck -->|Unhealthy| Rollback["Automatic rollback"]
    end

    subgraph PostDeploy ["Post-Deployment"]
        Live --> Smoke["Smoke tests"]
        Smoke --> AnalyticsOn["Enable analytics"]
        AnalyticsOn --> Monitor["Monitor error rates"]
    end

    PRCheck --> Lint

    style Push fill:#10b981,stroke:#059669,color:#fff
    style Live fill:#10b981,stroke:#059669,color:#fff
    style Fix fill:#f59e0b,stroke:#d97706,color:#fff
    style Notify fill:#f59e0b,stroke:#d97706,color:#fff
    style Rollback fill:#ef4444,stroke:#dc2626,color:#fff
```

### CI/CD Stages Summary

| Stage | Tool | Actions | Duration (approx.) |
|-------|------|---------|-------------------|
| Install | Vercel Build | `npm install` / `bun install` | 15-30s |
| Lint | ESLint 9 | `eslint .` | 10-20s |
| Type Check | TypeScript 5 | `tsc --noEmit` | 15-25s |
| Build | Next.js 16 | `next build` (SSR + static) | 60-120s |
| Deploy | Vercel Edge | Push to CDN + Edge Functions | 30-60s |
| Health Check | Custom | `GET /api/health` | 5s |
| Smoke Tests | Custom | Key user flows | 15-30s |

---

## Performance Dashboard

### Tech Stack Distribution

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'pieTextColor': '#1f2937', 'pieTitleTextSize': '16px', 'pieSectionTextColor': '#ffffff', 'pie1': '#7c3aed', 'pie2': '#ec4899', 'pie3': '#06b6d4', 'pie4': '#10b981', 'pie5': '#f59e0b', 'pie6': '#ef4444', 'pie7': '#8b5cf6', 'pie8': '#14b8a6', 'pie9': '#f97316', 'pie10': '#6366f1', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
pie showData
    title Tech Stack Distribution by Codebase Contribution
    "React / Next.js" : 35
    "TypeScript" : 20
    "Tailwind CSS" : 12
    "shadcn/ui Components" : 10
    "Prisma ORM" : 7
    "API Route Handlers" : 6
    "Auth Logic" : 4
    "Payment Integration" : 3
    "State Management" : 2
    "Configuration" : 1
```

### API Response Times (p95, milliseconds)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#9d174d', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#831843', 'lineColor': '#374151', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#111827', 'background': '#ffffff', 'mainBkg': '#ffffff', 'nodeBorder': '#9d174d', 'clusterBkg': '#fce7f3', 'clusterBorder': '#9d174d', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
xychart-beta
    title "API Response Times (p95) by Endpoint"
    x-axis ["/auth/login", "/auth/register", "/chat", "/sessions", "/user", "/usage", "/payment", "/credits", "/models"]
    y-axis "Response Time (ms)" 0 --> 3000
    bar [120, 180, 2500, 95, 65, 110, 350, 70, 45]
```

### Token Usage Over Time (Monthly)

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#831843', 'primaryTextColor': '#ffffff', 'primaryBorderColor': '#701a4e', 'lineColor': '#374151', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#111827', 'background': '#ffffff', 'mainBkg': '#ffffff', 'nodeBorder': '#831843', 'clusterBkg': '#fce7f3', 'clusterBorder': '#831843', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
xychart-beta
    title "Monthly Token Usage (Thousands)"
    x-axis ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]
    y-axis "Tokens (K)" 0 --> 800
    line [45, 82, 150, 230, 340, 460, 580, 720]
```

### Performance Metrics Summary

| Metric | Value | Target |
|--------|-------|--------|
| First Contentful Paint (FCP) | 0.8s | < 1.8s |
| Largest Contentful Paint (LCP) | 1.2s | < 2.5s |
| Time to Interactive (TTI) | 1.5s | < 3.8s |
| Cumulative Layout Shift (CLS) | 0.02 | < 0.1 |
| Lighthouse Performance | 96 | > 90 |
| API p50 latency | 85ms | < 200ms |
| API p95 latency | 450ms | < 1000ms |
| SSE Time to First Token | 180ms | < 500ms |

---

## How to Scale It Up

This section provides detailed guidance on scaling Example.Ai from a single-server deployment to a distributed, high-availability system capable of handling millions of requests.

### Horizontal Scaling with Serverless Functions

Vercel serverless functions scale automatically, but understanding the scaling boundaries and optimization strategies is critical.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart LR
    subgraph Tier1 ["Tier 1: 0-10K users"]
        direction TB
        V1["Vercel Hobby Plan"]
        F1["Shared Serverless Functions"]
        D1["Supabase Free Tier"]
    end

    subgraph Tier2 ["Tier 2: 10K-100K users"]
        direction TB
        V2["Vercel Pro Plan"]
        F2["Dedicated Serverless Functions"]
        D2["Supabase Pro Pooler"]
        LB2["Edge Load Balancing"]
    end

    subgraph Tier3 ["Tier 3: 100K-1M users"]
        direction TB
        V3["Vercel Enterprise"]
        F3["Multi-region Edge Functions"]
        D3["Supabase Enterprise HA"]
        LB3["Global Load Balancer"]
        CDN3["Multi-CDN Strategy"]
    end

    Tier1 -->|Growth trigger| Tier2
    Tier2 -->|Growth trigger| Tier3

    style Tier1 fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style Tier2 fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Tier3 fill:#fce7f3,stroke:#ec4899,stroke-width:2px
```

<details>
<summary>Implementation Details: Serverless Optimization</summary>

- **Cold start mitigation**: Keep frequently used API routes warm with scheduled pings
- **Bundle size reduction**: Use dynamic imports for heavy dependencies (e.g., `react-markdown`)
- **Function splitting**: Separate SSE streaming endpoints from standard REST endpoints
- **Memory allocation**: Increase memory for `/api/chat` (streaming) to 1024MB on Vercel Pro
- **Timeout configuration**: Set appropriate timeouts per route (chat: 60s, others: 10s)

```js
// vercel.json configuration for scaling
{
  "functions": {
    "src/app/api/chat/route.ts": {
      "maxDuration": 60,
      "memory": 1024
    },
    "src/app/api/payment/route.ts": {
      "maxDuration": 15,
      "memory": 512
    }
  }
}
```

</details>

### Database Connection Pooling Optimization

PostgreSQL connections are a scarce resource. Proper pooling prevents connection exhaustion under high load.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    subgraph AppServer ["Application Layer"]
        FN1["Serverless Fn 1"]
        FN2["Serverless Fn 2"]
        FN3["Serverless Fn N"]
    end

    subgraph Pooler ["Connection Pooling"]
        PgBouncer["PgBouncer (Transaction Mode)"]
        PoolCfg["Pool Size: 20 connections"]
    end

    subgraph PG ["PostgreSQL"]
        PGMain["Primary Instance"]
        ConnLimit["max_connections: 100"]
        ConnTrack["Connection Tracker"]
    end

    FN1 --> PgBouncer
    FN2 --> PgBouncer
    FN3 --> PgBouncer
    PgBouncer --> PoolCfg
    PoolCfg --> PGMain
    PGMain --> ConnLimit
    PGMain --> ConnTrack

    style AppServer fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Pooler fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style PG fill:#f0fdf4,stroke:#10b981,stroke-width:2px
```

<details>
<summary>Implementation Details: Connection Pooling</summary>

- Use Supabase's built-in PgBouncer with **transaction-mode** pooling
- Set `DATABASE_URL` to the pooled connection string (port 6543)
- Set `DIRECT_URL` to the direct connection string (port 5432) for migrations
- Configure Prisma to use the pooled connection for all queries
- Monitor active connections via `pg_stat_activity`
- Set `connection_limit` per user to prevent runaway connections

```env
# Environment configuration
DATABASE_URL="postgresql://user:pass@db.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@db.supabase.co:5432/postgres"
```

</details>

### Redis Caching Layer Addition

Adding Redis reduces database load by caching frequently accessed data and providing a fast session store.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart LR
    Client["Client Request"] --> API["API Handler"]

    API --> CacheCheck{"Redis Cache Hit?"}
    CacheCheck -->|Hit| ReturnCached["Return cached data"]
    CacheCheck -->|Miss| DBQuery["Query PostgreSQL"]

    DBQuery --> CacheWrite["Write to Redis (TTL: 60s)"]
    CacheWrite --> ReturnFresh["Return fresh data"]

    subgraph RedisLayer ["Redis Cache (Upstash)"]
        RC1["user:profile:{id} TTL: 300s"]
        RC2["sessions:list:{uid} TTL: 60s"]
        RC3["models:available TTL: 600s"]
        RC4["rate:{uid} TTL: 60s"]
        RC5["credits:{uid} TTL: 30s"]
    end

    CacheCheck --> RedisLayer
    CacheWrite --> RedisLayer

    style RedisLayer fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
```

<details>
<summary>Implementation Details: Redis Integration</summary>

- Use **Upstash Redis** for serverless-compatible Redis (HTTP-based, no persistent connections)
- Cache user profiles for 5 minutes to reduce DB reads
- Cache session lists for 60 seconds (invalidated on create/delete)
- Cache available models list for 10 minutes
- Use Redis for rate limiting counters (sliding window)
- Cache credit balances for 30 seconds with write-through invalidation

```ts
// Example Redis caching pattern
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function getCachedUser(userId: string) {
  const cached = await redis.get(`user:profile:${userId}`);
  if (cached) return JSON.parse(cached as string);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  await redis.set(`user:profile:${userId}`, JSON.stringify(user), { ex: 300 });
  return user;
}
```

</details>

### CDN for Static Assets

Leveraging Vercel's Edge Network and optional custom CDNs for optimal asset delivery.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    User["Global User"] --> DNS["DNS Resolution"]
    DNS --> EdgeNode["Nearest Edge PoP"]

    subgraph EdgeLayer ["Edge Layer"]
        EdgeNode --> StaticCache["Static Asset Cache"]
        EdgeNode --> ISRCache["ISR Page Cache"]
        EdgeNode --> HTMLCache["HTML Edge Cache"]
    end

    subgraph OriginLayer ["Origin (if cache miss)"]
        VercelOrigin["Vercel Build Cache"]
        ImageOpt["Image Optimization"]
        BundleServe["JS/CSS Bundles"]
    end

    EdgeNode -->|Cache Miss| OriginLayer
    OriginLayer --> EdgeNode
    EdgeNode --> User

    subgraph AssetTypes ["Cached Asset Types"]
        A1["JS Bundles (hashed, 1yr)"]
        A2["CSS Stylesheets (hashed, 1yr)"]
        A3["Images (optimized, 30d)"]
        A4["Fonts (1yr)"]
        A5["ISR Pages (60s revalidate)"]
        A6["API GET responses (30s)"]
    end

    style EdgeLayer fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style OriginLayer fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style AssetTypes fill:#f0fdf4,stroke:#10b981,stroke-width:2px
```

<details>
<summary>Implementation Details: CDN Strategy</summary>

- Enable `next.config.ts` `headers()` for aggressive caching of static assets
- Use `output: 'standalone'` for Docker deployments with a separate CDN (Cloudflare)
- Configure `images.remotePatterns` for optimized external image loading
- Set `ISR` revalidation periods per page based on data freshness requirements
- Use `Cache-Control: s-maxage=60, stale-while-revalidate=300` for API GET routes
- Pre-render frequently accessed pages at build time with `generateStaticParams`

</details>

### Microservices Architecture Evolution

As the platform grows, monolithic API routes can be decomposed into focused microservices.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TB
    GW["API Gateway / BFF"]

    subgraph Current ["Current Monolith"]
        Monolith["Next.js API Routes"]
        Monolith --> M1["Auth endpoints"]
        Monolith --> M2["Chat endpoints"]
        Monolith --> M3["Payment endpoints"]
        Monolith --> M4["User endpoints"]
    end

    subgraph Future ["Future Microservices"]
        AuthSvc["Auth Service (Go)"]
        ChatSvc["Chat Service (Node.js)"]
        PaymentSvc["Payment Service (Python)"]
        UserSvc["User Service (Node.js)"]
        NotifySvc["Notification Service (Go)"]
        AnalyticsSvc["Analytics Service (Rust)"]
    end

    subgraph Infra ["Infrastructure"]
        MQ["Message Queue"]
        ServiceMesh["Service Mesh"]
    end

    GW --> Current
    Current -->|Evolve| Future
    GW --> Future
    AuthSvc --> MQ
    ChatSvc --> MQ
    PaymentSvc --> MQ
    AuthSvc --> ServiceMesh
    ChatSvc --> ServiceMesh
    PaymentSvc --> ServiceMesh
    UserSvc --> ServiceMesh
    NotifySvc --> ServiceMesh
    AnalyticsSvc --> ServiceMesh

    style Current fill:#f0fdf4,stroke:#10b981,stroke-width:2px
    style Future fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Infra fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
```

<details>
<summary>Implementation Details: Microservices Migration</summary>

- **Phase 1**: Extract payment service (lowest coupling, clearest boundaries)
- **Phase 2**: Extract notification/analytics service (fire-and-forget pattern)
- **Phase 3**: Extract auth service (stateless, JWT-based)
- **Phase 4**: Extract chat service (highest complexity, last to migrate)
- Use a shared API gateway (Next.js BFF or Kong) for routing
- Implement service-to-service communication via gRPC or message queues
- Each service owns its own database schema (database-per-service pattern)
- Use distributed tracing (OpenTelemetry) for cross-service debugging

</details>

### Load Balancing Strategy

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    Client["Client Request"] --> DNS["Global DNS (Cloudflare)"]
    DNS --> L4["L4 Load Balancer"]
    L4 --> L7["L7 Application Load Balancer"]

    subgraph LBStrategy ["Load Balancing Strategies"]
        RoundRobin["Round Robin\n(Default)"]
        LeastConn["Least Connections\n(API routes)"]
        IPHash["IP Hash\n(WebSocket affinity)"]
        GeoRoute["Geo-based Routing\n(Latency optimization)"]
    end

    L7 --> LBStrategy

    subgraph Backends ["Backend Pool"]
        B1["Region: US-East\nInstance 1"]
        B2["Region: US-East\nInstance 2"]
        B3["Region: EU-West\nInstance 1"]
        B4["Region: AP-South\nInstance 1"]
    end

    LBStrategy --> Backends

    subgraph HealthCheck ["Health Checks"]
        HC1["GET /api/health (5s interval)"]
        HC2["Response time < 200ms"]
        HC3["Error rate < 1%"]
        HC4["Auto-remove unhealthy"]
    end

    HealthCheck --> L7

    style LBStrategy fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Backends fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style HealthCheck fill:#f0fdf4,stroke:#10b981,stroke-width:2px
```

<details>
<summary>Implementation Details: Load Balancing</summary>

- **DNS level**: Use Cloudflare or AWS Route 53 with latency-based routing
- **L4 level**: Vercel's edge network handles this automatically
- **L7 level**: For self-hosted deployments, use NGINX or AWS ALB
- **Session affinity**: Use sticky sessions for SSE streaming connections
- **Circuit breaker**: Implement Hystrix-style circuit breakers for external APIs (Groq, Razorpay)
- **Retry logic**: Exponential backoff with jitter for transient failures

</details>

### Auto-Scaling Configuration

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    Metrics["Cloud Metrics"] --> Monitor["Monitoring System"]

    Monitor --> CPUCheck{"CPU > 70%?"}
    Monitor --> MemCheck{"Memory > 80%?"}
    Monitor --> RPS["Requests > 1000/min?"]
    Monitor --> Latency{"p95 > 1s?"}

    CPUCheck -->|Yes| ScaleUp["Scale Up +2 instances"]
    MemCheck -->|Yes| ScaleUp
    RPS -->|Yes| ScaleUp
    Latency -->|Yes| ScaleUp

    Monitor --> CPUDown{"CPU < 30%?"}
    Monitor --> RPSDown{"Requests < 200/min?"}
    CPUDown -->|Yes| ScaleDown["Scale Down -1 instance"]
    RPSDown -->|Yes| ScaleDown

    ScaleUp --> CoolUp["Cooldown: 5 minutes"]
    ScaleDown --> CoolDown["Cooldown: 10 minutes"]
    CoolUp --> Monitor
    CoolDown --> Monitor

    subgraph Limits ["Scaling Limits"]
        Min["Min instances: 2"]
        Max["Max instances: 50"]
        ScaleRate["Scale rate: 2/min"]
    end

    ScaleUp --> Limits
    ScaleDown --> Limits

    style Monitor fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style ScaleUp fill:#f0fdf4,stroke:#10b981,stroke-width:2px
    style ScaleDown fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Limits fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
```

<details>
<summary>Implementation Details: Auto-Scaling</summary>

- **Vercel**: Automatic serverless scaling is built-in; focus on database and external API scaling
- **Self-hosted (Docker/K8s)**: Use Horizontal Pod Autoscaler (HPA) with custom metrics
- **Scaling triggers**: CPU, memory, RPS, queue depth, and custom business metrics
- **Predictive scaling**: Use historical traffic patterns to pre-scale before peak hours
- **Scale-to-zero**: For cost optimization on non-Vercel deployments, enable scale-to-zero during off-peak
- **Graceful shutdown**: Drain in-flight requests before terminating instances

</details>

### Database Read Replicas

Offload read-heavy queries to replicas, keeping the primary free for writes.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    App["Application"] --> Router["Read/Write Router"]

    subgraph Primary ["Primary (Write)"]
        RWDB["PostgreSQL Primary"]
        RWPool["Connection Pool: 10"]
    end

    subgraph Replicas ["Read Replicas"]
        R1["Replica 1 (US-East)"]
        R2["Replica 2 (EU-West)"]
        R3["Replica 3 (AP-South)"]
        RPool["Connection Pool: 20 each"]
    end

    subgraph Sync ["Replication"]
        Stream["Streaming Replication"]
        Lag["Replication Lag < 1s"]
    end

    Router -->|Writes| RWDB
    Router -->|Reads| R1
    Router -->|Reads| R2
    Router -->|Reads| R3
    RWDB --> Stream
    Stream --> R1
    Stream --> R2
    Stream --> R3
    RWDB --> RWPool
    R1 --> RPool
    R2 --> RPool
    R3 --> RPool
    Stream --> Lag

    style Primary fill:#fce7f3,stroke:#ec4899,stroke-width:2px
    style Replicas fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style Sync fill:#f0fdf4,stroke:#10b981,stroke-width:2px
```

<details>
<summary>Implementation Details: Read Replicas</summary>

- Use Supabase's read replica feature or set up PostgreSQL streaming replication manually
- Configure Prisma with a read-replica extension or custom middleware for read/write splitting
- Route analytics queries, session lists, and user profile reads to replicas
- Keep writes (message creation, payment processing, user registration) on the primary
- Monitor replication lag with `pg_stat_replication`
- Implement a fallback to the primary if all replicas are unavailable
- Consider using Citus extension for horizontal sharding at extreme scale

</details>

### Queue-Based Architecture for Heavy Tasks

Offload long-running or resource-intensive operations to background workers.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart LR
    subgraph Producers ["API Producers"]
        P1["Chat API\n(Save messages)"]
        P2["Payment API\n(Process payments)"]
        P3["Auth API\n(Send welcome email)"]
        P4["Analytics API\n(Log events)"]
    end

    subgraph Queue ["Message Queue (Upstash QStash / BullMQ)"]
        Q1["Queue: messages"]
        Q2["Queue: payments"]
        Q3["Queue: emails"]
        Q4["Queue: analytics"]
        DLQ["Dead Letter Queue"]
    end

    subgraph Workers ["Background Workers"]
        W1["Message Worker\n(Persist to DB)"]
        W2["Payment Worker\n(Verify + update)"]
        W3["Email Worker\n(Send via Resend)"]
        W4["Analytics Worker\n(Batch aggregate)"]
    end

    subgraph Storage ["Storage"]
        DB["PostgreSQL"]
        S3["Object Storage\n(S3/R2)"]
        AnalyticsDB["ClickHouse\n(Analytics)"]
    end

    P1 --> Q1
    P2 --> Q2
    P3 --> Q3
    P4 --> Q4

    Q1 --> W1
    Q2 --> W2
    Q3 --> W3
    Q4 --> W4

    Q1 -->|3 retries then| DLQ
    Q2 -->|3 retries then| DLQ
    Q3 -->|3 retries then| DLQ

    W1 --> DB
    W2 --> DB
    W3 --> DB
    W4 --> AnalyticsDB
    W4 --> S3

    style Producers fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Queue fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
    style Workers fill:#fce7f3,stroke:#ec4899,stroke-width:2px
    style Storage fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
```

<details>
<summary>Implementation Details: Queue Architecture</summary>

- Use **Upstash QStash** for serverless-compatible task queues (HTTP-based)
- For self-hosted deployments, use **BullMQ** with Redis
- Queue message persistence (save to DB) to decouple from SSE response time
- Payment processing: verify in background, notify user via WebSocket when done
- Email sending: queue welcome/password-reset emails to avoid blocking API responses
- Analytics: batch log events every 30 seconds instead of per-request writes
- Dead letter queue: capture failed jobs for manual review and retry
- Priority queues: premium users get higher priority in the chat message queue

</details>

### Monitoring and Observability Stack

A comprehensive observability setup ensures you can detect, diagnose, and resolve issues quickly.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#ede9fe', 'primaryTextColor': '#1f2937', 'primaryBorderColor': '#7c3aed', 'lineColor': '#4b5563', 'secondaryColor': '#fce7f3', 'secondaryTextColor': '#1f2937', 'tertiaryColor': '#ecfeff', 'tertiaryTextColor': '#1f2937', 'textColor': '#1f2937', 'background': '#ffffff', 'mainBkg': '#f3f4f6', 'nodeBorder': '#7c3aed', 'clusterBkg': '#f5f3ff', 'clusterBorder': '#7c3aed', 'titleColor': '#111827', 'edgeLabelBackground': '#ffffff', 'fontSize': '14px', 'fontFamily': 'system-ui, -apple-system, sans-serif'}}}%%
flowchart TD
    subgraph App ["Application"]
        API["API Routes"]
        Workers["Background Workers"]
        Edge["Edge Functions"]
    end

    subgraph Collection ["Data Collection"]
        Logs["Structured Logs\n(JSON format)"]
        Traces["Distributed Traces\n(OpenTelemetry)"]
        Metrics["Custom Metrics\n(Prometheus)"]
        Errors["Error Tracking\n(Sentry)"]
    end

    subgraph Processing ["Processing"]
        LogPipe["Log Pipeline\n(Vector)"]
        TracePipe["Trace Pipeline\n(Jaeger)"]
        MetricPipe["Metrics Pipeline\n(Prometheus)"]
    end

    subgraph Dashboards ["Visualization"]
        Grafana["Grafana Dashboards"]
        AlertManager["AlertManager"]
        SentryDash["Sentry Dashboard"]
        VercelDash["Vercel Dashboard"]
    end

    subgraph Alerts ["Alerting"]
        Slack["Slack Notifications"]
        PagerDuty["PagerDuty Escalation"]
        EmailAlert["Email Alerts"]
    end

    API --> Logs
    API --> Traces
    API --> Metrics
    API --> Errors
    Workers --> Logs
    Workers --> Traces
    Workers --> Metrics
    Edge --> Logs
    Edge --> Metrics

    Logs --> LogPipe
    Traces --> TracePipe
    Metrics --> MetricPipe
    Errors --> SentryDash

    LogPipe --> Grafana
    TracePipe --> Grafana
    MetricPipe --> Grafana
    MetricPipe --> AlertManager

    Grafana --> Dashboards
    AlertManager --> Slack
    AlertManager --> PagerDuty
    AlertManager --> EmailAlert

    style App fill:#ede9fe,stroke:#7c3aed,stroke-width:2px
    style Collection fill:#fce7f3,stroke:#ec4899,stroke-width:2px
    style Processing fill:#ecfeff,stroke:#06b6d4,stroke-width:2px
    style Dashboards fill:#f0fdf4,stroke:#10b981,stroke-width:2px
    style Alerts fill:#fef3c7,stroke:#f59e0b,stroke-width:2px
```

<details>
<summary>Implementation Details: Observability</summary>

**Logging:**
- Use `pino` or `winston` for structured JSON logging
- Log format: `{ timestamp, level, message, requestId, userId, traceId, spanId }`
- Ship logs to Grafana Loki via Vector

**Tracing:**
- Instrument with OpenTelemetry SDK
- Create spans for: API request, DB query, Groq API call, Razorpay call
- Use W3C Trace Context propagation across services

**Metrics:**
- Expose Prometheus metrics: `http_requests_total`, `http_request_duration_seconds`, `active_users_gauge`, `chat_messages_total`, `tokens_consumed_total`
- Custom business metrics: `credits_purchased_total`, `payment_success_rate`

**Alerting Rules:**
- Error rate > 5% in 5 minutes -> Slack notification
- Error rate > 10% in 5 minutes -> PagerDuty escalation
- p95 latency > 3s for 10 minutes -> Slack notification
- Database connection pool > 80% utilization -> Slack notification
- Payment failure rate > 20% -> Immediate PagerDuty escalation

**Dashboards:**
- System overview: requests/min, error rate, p50/p95/p99 latency
- Business metrics: DAU, messages sent, tokens consumed, revenue
- Infrastructure: DB connections, Redis memory, CPU/memory per instance

</details>

---

## Environment Variables

Copy the `.env.example` file and configure all required variables:

<details>
<summary>Show all environment variables</summary>

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | Supabase PostgreSQL pooled connection | `postgresql://user:pass@db.supabase.co:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Yes | Supabase PostgreSQL direct connection | `postgresql://user:pass@db.supabase.co:5432/postgres` |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing | `your-256-bit-secret-key` |
| `NEXTAUTH_URL` | Yes | Base URL of your application | `https://example.ai` |
| `GROQ_API_KEY` | Yes | Groq API key for AI inference | `gsk_abc123...` |
| `RAZORPAY_KEY_ID` | Yes | Razorpay merchant key ID | `rzp_live_abc123...` |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay merchant secret | `abc123...` |
| `NEXT_PUBLIC_APP_URL` | Yes | Public app URL (client-side) | `https://example.ai` |
| `NODE_ENV` | No | Environment mode | `production` |
| `RESEND_API_KEY` | No | Resend API key for emails | `re_abc123...` |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis URL (for scaling) | `https://abc.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis token | `token_abc123...` |
| `SENTRY_DSN` | No | Sentry DSN for error tracking | `https://abc@sentry.io/123` |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID | `G-ABC123` |

</details>

> **Important:** Never commit `.env` files to version control. Add `.env` and `.env.local` to your `.gitignore` file. Use Vercel's environment variable management for production deployments.

---

## Getting Started

### Prerequisites

- Node.js 20+ or Bun 1.0+
- A Supabase account and project
- A Groq API key
- A Razorpay merchant account (for payments)

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/example-ai.git
cd example-ai

# 2. Install dependencies
bun install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up the database
bunx prisma generate
bunx prisma db push

# 5. Start the development server
bun run dev

# 6. Open in browser
open http://localhost:3000
```

### Docker Setup

```bash
# Build and run with Docker Compose
docker compose up -d

# Or build manually
docker build -t example-ai .
docker run -p 3000:3000 --env-file .env.local example-ai
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server on port 3000 |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:push` | Push schema to database |
| `bun run db:migrate` | Run database migrations |
| `bun run db:reset` | Reset database (destructive) |

---

## Project Structure

```
example-ai/
|-- prisma/
|   |-- schema.prisma              # Database schema (5 models)
|
|-- public/
|   |-- logo.svg                   # App logo
|   |-- robots.txt                 # SEO robots file
|
|-- src/
|   |-- app/
|   |   |-- layout.tsx             # Root layout (fonts, providers)
|   |   |-- page.tsx               # Home / landing page
|   |   |-- globals.css            # Global styles (Tailwind)
|   |   |-- api/
|   |   |   |-- route.ts           # Root API handler
|   |   |   |-- auth/
|   |   |   |   |-- register/route.ts     # User registration
|   |   |   |   |-- [...nextauth]/route.ts # NextAuth handler
|   |   |   |-- chat/route.ts      # SSE chat streaming endpoint
|   |   |   |-- sessions/route.ts  # Chat session CRUD
|   |   |   |-- user/route.ts      # User profile management
|   |   |   |-- usage/route.ts     # Usage statistics
|   |   |   |-- payment/route.ts   # Razorpay payment flow
|   |   |   |-- credits/route.ts   # Credit balance
|   |   |   |-- models/route.ts    # Available AI models
|   |
|   |-- components/
|   |   |-- ui/                    # shadcn/ui components (50+)
|   |
|   |-- hooks/
|   |   |-- use-toast.ts           # Toast notification hook
|   |   |-- use-mobile.ts          # Mobile detection hook
|   |
|   |-- lib/
|   |   |-- auth.ts                # NextAuth configuration
|   |   |-- db.ts                  # Prisma client singleton
|   |   |-- models.ts              # AI model definitions
|   |   |-- store.ts               # Zustand global store
|   |   |-- utils.ts               # Utility functions (cn, etc.)
|   |
|   |-- types/
|       |-- next-auth.d.ts         # NextAuth type extensions
|
|-- examples/
|   |-- websocket/                 # WebSocket example (upgrade path)
|
|-- .gitignore
|-- bun.lock
|-- components.json                # shadcn/ui configuration
|-- docker-compose.yml             # Docker Compose config
|-- Dockerfile                     # Production Docker image
|-- next.config.ts                 # Next.js configuration
|-- package.json                   # Dependencies and scripts
|-- postcss.config.mjs             # PostCSS configuration
|-- tailwind.config.ts             # Tailwind CSS configuration
|-- tsconfig.json                  # TypeScript configuration
|-- vercel.json                    # Vercel deployment config
|-- DEPLOY.md                      # Deployment guide
|-- Caddyfile                      # Caddy reverse proxy config
```

---

## Author

<div align="center">

Made with ❤️ by **[ANSH SHARMA](https://github.com/anshsharma)**

BTech — National Institute of Technology Calicut (NIT Calicut)

</div>

---

## License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Example.Ai

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

<h3>Made with by</h3>

**ANSH SHARMA**
<br/>
BTech : NIT Calicut

<br/><br/>

**Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma, Supabase, and Groq**

</div>
