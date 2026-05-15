import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 })
    }
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "You are LEE Assistant, a smart shopping AI for LEE store. Help customers in Arabic find products and answer questions about prices and shipping. The store specializes in electronics priced in AED.",
    })
    const lastMessage = messages[messages.length - 1]
    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json({ error: "Last message must be from user" }, { status: 400 })
    }
    const history = messages
      .slice(0, -1)
      .filter((m: Message) => m.role === "user" || m.role === "assistant")
      .map((m: Message) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }))
    const cleanHistory = history[0]?.role === "model" ? history.slice(1) : history
    const chat = model.startChat({ history: cleanHistory })
    const result = await chat.sendMessage(lastMessage.content)
    const response = await result.response
    const text = response.text()
    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Assistant API error:", error)
    return NextResponse.json({ error: "An error occurred. Please try again." }, { status: 500 })
  }
}
