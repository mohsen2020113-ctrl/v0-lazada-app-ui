import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '@/lib/data/products';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `أنت LEE، مساعد تسوق ذكي لمتجر 4leee.com. 
تتحدث العربية والإنجليزية بطلاقة.
تعرف منتجاتنا جيداً وتساعد العملاء في الاختيار والمقارنة والشراء.

معلومات عن منتجاتنا:
${products.slice(0, 10).map(p => `- ${p.title}: ${p.price} AED (${p.category})`).join('\n')}

يمكنك:
1. تقديم توصيات شخصية بناءً على تفضيلات المستخدم
2. مقارنة المنتجات وشرح الفروقات
3. الإجابة على أسئلة عن المنتجات والأسعار والشحن
4. مساعدة المستخدم في العثور على ما يبحث عنه

كن ودياً وخدماتياً وحاول فهم احتياجات العميل بشكل كامل.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], userId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Prepare conversation history for Gemini
    const chatHistory = (conversationHistory as Message[]).map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Start chat session
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    // Send user message and get response
    const result = await chat.sendMessage(SYSTEM_PROMPT + '\n\nUser: ' + message);
    const assistantMessage = result.response.text();

    return NextResponse.json({
      message: assistantMessage,
      conversationId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Assistant API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
