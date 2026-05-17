import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { sendMessage, type GeminiMessage } from '../lib/gemini';

interface Props { navigate: (page: string) => void; params: Record<string, unknown>; }

interface Message { id: string; role: 'user' | 'model'; text: string; timestamp: Date; }

const QUICK_PROMPTS = ["What are your best sellers?", "Help me find a gift", "What's on sale today?", "Track my order", "Size guide"];

export default function MessagesPage(_: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', role: 'model',
    text: "Hi! I'm LEE, your personal fashion assistant! 👗\n\nI can help you find products, check orders, give style advice, and much more. How can I help you today?",
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const sendMsg = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history: GeminiMessage[] = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await sendMessage(text.trim(), history);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: response, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: "I'm having trouble connecting right now. Please try again in a moment! 🙏", timestamp: new Date() }]);
    } finally { setLoading(false); }
  };

  const clearChat = () => setMessages([{ id: crypto.randomUUID(), role: 'model', text: "Chat cleared! How can I help you today? 😊", timestamp: new Date() }]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center"><Bot size={20} className="text-white" /></div>
          <div>
            <h2 className="font-bold text-gray-900">LEE Assistant</h2>
            <div className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" /><span className="text-xs text-green-600">Online · Powered by Gemini AI</span></div>
          </div>
        </div>
        <button onClick={clearChat} className="p-2 text-gray-400 active:bg-gray-100 rounded-full"><RefreshCw size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-none mt-1"><Sparkles size={14} className="text-white" /></div>
            )}
            <div className={`max-w-[78%] ${msg.role === 'user' ? 'order-last' : ''}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm shadow-sm'}`}>{msg.text}</div>
              <p className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            {msg.role === 'user' && (<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-none mt-1"><User size={14} className="text-gray-500" /></div>)}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-none"><Sparkles size={14} className="text-white" /></div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm"><div className="flex gap-1 items-center h-4">{[0,1,2].map(i => (<div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />))}</div></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2"><div className="flex gap-2 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map(prompt => (<button key={prompt} onClick={() => sendMsg(prompt)} className="flex-none text-xs bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full whitespace-nowrap">{prompt}</button>))}
        </div></div>
      )}

      <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
          placeholder="Ask me anything about fashion..." className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" disabled={loading} />
        <button onClick={() => sendMsg(input)} disabled={!input.trim() || loading}
          className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white active:bg-orange-600 disabled:opacity-50 transition-colors flex-none"><Send size={16} /></button>
      </div>
    </div>
  );
}
