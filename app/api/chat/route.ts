import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const prompt = messages[messages.length - 1]?.content || "Hello from AstroLog";

    const model = genAI.getGenerativeModel({ model: "models/gemini-pro" }); // ✅ this must be exact

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error("💥 Gemini Error:", error);
    return NextResponse.json({
      reply: "Gemini API failed: " + (error?.message || "Unknown error"),
    });
  }
}
