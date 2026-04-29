import { NextResponse } from "next/server";
import { AI_MODELS } from "@/lib/models";

export async function GET() {
  return NextResponse.json({ models: AI_MODELS });
}
