# LAZADA E-COMMERCE COMPLETE DEPLOYMENT GUIDE

## STEP 1: FIX GEMINI API ROUTE

File: `app/api/assistant/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Message {
  role: 'user' | 'assistant';
    content: string;
    }

    export async function POST(request: NextRequest) {
      try {
          const { message, history = [] } = await request.json();

              if (!message || typeof message !== 'string') {
                    return NextResponse.json(
                            { error: 'Message is required' },
                                    { status: 400 }
                                          );
                                              }

                                                  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

                                                      const transformedHistory: Array<{ role: string; parts: Array<{ text: string }> }> = history.map(
                                                            (msg: Message) => ({
                                                                    role: msg.role === 'user' ? 'user' : 'model',
                                                                            parts: [{ text: msg.content }],
                                                                                  })
                                                                                      );

                                                                                          const chat = model.startChat({
                                                                                                history: transformedHistory.length > 0 ? transformedHistory : undefined,
                                                                                                      generationConfig: {
                                                                                                              maxOutputTokens: 1024,
                                                                                                                      temperature: 0.7,
                                                                                                                            },
                                                                                                                                });
                                                                                                                                
                                                                                                                                    const result = await chat.sendMessage(message);
                                                                                                                                        const response = await result.response;
                                                                                                                                            const text = response.text();
                                                                                                                                            
                                                                                                                                                return NextResponse.json({
                                                                                                                                                      success: true,
                                                                                                                                                            message: text,
                                                                                                                                                                  role: 'assistant',
                                                                                                                                                                      });
                                                                                                                                                                        } catch (error: any) {
                                                                                                                                                                            console.error('Gemini API Error:', error);
                                                                                                                                                                                return NextResponse.json(
                                                                                                                                                                                      { error: error?.message || 'Failed to process request' },
                                                                                                                                                                                            { status: 500 }
                                                                                                                                                                                                );
                                                                                                                                                                                                  }
                                                                                                                                                                                                  }
                                                                                                                                                                                                  ```
