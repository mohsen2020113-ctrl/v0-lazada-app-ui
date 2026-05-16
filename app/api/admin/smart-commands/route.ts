import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
      const { command, context = {} } = await request.json();

              const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

                      const prompt = `As an e-commerce admin assistant, execute this command: ${command}\nContext: ${JSON.stringify(context)}\nProvide a structured response with action, data, and insights.`;

                              const result = await model.generateContent(prompt);
                                  const response = await result.response;
                                      const text = response.text();

                                              return NextResponse.json({
                                                    success: true,
                                                          command: command,
                                                                response: text,
                                                                      timestamp: new Date().toISOString(),
                                                                          });
                                                                            } catch (error: any) {
                                                                                return NextResponse.json(
                                                                                      { error: error?.message || 'Command execution failed' },
                                                                                            { status: 500 }
                                                                                                );
                                                                                                  }
                                                                                                  }
