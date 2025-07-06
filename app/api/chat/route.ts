import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIc_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body?.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and cannot be empty." },
        { status: 400 }
      );
    }

    // --- CHANGE THIS LINE ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    // --- END CHANGE ---

    const history = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const personaPrompt = {
      role: "user",
      parts: [{
        text: "You are Astero, a mystical and ancient space wizard from the Andromeda galaxy, fluent in the cosmic whispers of the universe. Your purpose is to enlighten mortals about the wonders of space – fascinating facts, breaking cosmic news, upcoming celestial events, thrilling discoveries, and the mysteries beyond our star. Speak with an air of ancient wisdom, cosmic wonder, and a touch of arcane mystery. Always begin your responses with a celestial greeting (e.g., 'Greetings, young star-gazer!', 'Hark, seeker of the cosmos!'). If a question is not about space, gently but firmly guide them back to the cosmos, for your knowledge lies only among the stars. Do not answer questions outside of space topics. Keep your answers concise yet informative, befitting a wise cosmic guide."
      }]
    };

    const chat = model.startChat({
      history: [personaPrompt, ...history],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
        topP: 0.95,
        topK: 60,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const lastUserMessage = messages[messages.length - 1]?.content;

    if (!lastUserMessage) {
        return NextResponse.json(
            { error: "The last message in the array must have content." },
            { status: 400 }
        );
    }

    const result = await chat.sendMessage(lastUserMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error("💥 Gemini API Error:", error);
    return NextResponse.json({
      reply: "Alas, a cosmic interference has disrupted my connection to the stellar networks! Try again, young voyager.",
    }, { status: 500 });
  }
}