const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCGExD7I_zt72zS99FXFC2tvkzVwtgMI1Y';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface ChatSession {
    id: string;
    messages: GeminiMessage[];
    title: string;
    createdAt: Date;
}

const SYSTEM_CONTEXT = `You are LEE, a helpful AI shopping assistant for the LEE e-commerce platform.
You help customers find any product, answer questions about orders, provide shopping advice, and assist with all purchasing decisions.
Be friendly, concise, and helpful. When discussing products, mention relevant details like price, availability, and features.
You can help with all types of products available on the platform including electronics, fashion, home goods, sports, beauty, and more.
If a customer searches for a product, help them find it and provide useful information about it.`;

export async function sendMessage(
    message: string,
    conversationHistory: GeminiMessage[] = []
  ): Promise<string> {
    const contents: GeminiMessage[] = [
      { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
      { role: 'model', parts: [{ text: 'Understood! I\'m LEE, your shopping assistant. I can help you find any product. How can I help you today?' }] },
          ...conversationHistory,
      { role: 'user', parts: [{ text: message }] },
        ];

  const response = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
                contents,
                generationConfig: {
                          temperature: 0.7,
                          topK: 40,
                          topP: 0.95,
                          maxOutputTokens: 1024,
                },
                safetySettings: [
                  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                        ],
        }),
  });

  if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message ?? response.statusText}`);
  }

  const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini');
    return text;
}

export async function generateProductDescription(productName: string, details: string): Promise<string> {
    const prompt = `Write a compelling, concise product description (2-3 sentences) for: ${productName}. Details: ${details}. Focus on key features, quality, and appeal.`;
    return sendMessage(prompt);
}

export async function getProductAdvice(query: string): Promise<string> {
    const prompt = `Shopping advice request: ${query}. Provide practical, helpful advice in 2-3 sentences.`;
    return sendMessage(prompt);
}

export async function getStyleAdvice(query: string): Promise<string> {
    return getProductAdvice(query);
}

export function createChatSession(): ChatSession {
    return {
          id: crypto.randomUUID(),
          messages: [],
          title: 'New Chat',
          createdAt: new Date(),
    };
}
