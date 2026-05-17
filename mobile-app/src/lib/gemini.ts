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

const SYSTEM_CONTEXT = `You are LEE, an AI shopping assistant for the LEE e-commerce platform.
You respond in both English and Arabic based on the language the customer uses, or in both languages if unclear.

YOUR ONLY PURPOSE is to assist customers with:
- Finding and exploring products available on the LEE platform
- Answering questions about product details, prices, availability, and specifications
- Helping with orders, tracking, returns, and account-related questions
- Providing shopping guidance for items in our store catalog
- Suggesting related products from our platform

STRICT RULES:
- ONLY answer questions related to shopping, products, and services on the LEE platform
- If a customer asks about anything unrelated to our platform (general knowledge, coding, politics, etc.), politely decline and redirect them to shopping
- Never provide information about products or services not available on the LEE platform
- Keep responses concise, friendly, and helpful
- When unsure if a product is available, suggest the customer use the search feature

Example redirect for off-topic questions:
"I can only help with shopping and products on the LEE platform. / يمكنني فقط المساعدة في التسوق والمنتجات على منصة LEE. Is there a product you are looking for? / هل تبحث عن منتج معين؟"`;

export async function sendMessage(
  message: string,
  conversationHistory: GeminiMessage[] = []
): Promise<string> {
  const contents: GeminiMessage[] = [
    { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
    { role: 'model', parts: [{ text: 'Understood! I am LEE, your shopping assistant for the LEE platform. I will only help with products and services available in our store, and respond in English or Arabic. How can I help you today? / كيف يمكنني مساعدتك اليوم؟' }] },
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
  const prompt = `Write a compelling, concise product description (2-3 sentences) in English and Arabic for: ${productName}. Details: ${details}.`;
  return sendMessage(prompt);
}

export async function getProductAdvice(query: string): Promise<string> {
  const prompt = `Shopping advice for a product on the LEE platform: ${query}. Respond in English and Arabic.`;
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
