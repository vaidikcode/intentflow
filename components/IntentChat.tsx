'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, AlertTriangle, RotateCcw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IntentChatProps {
  userAddress: string;
  onIntentSaved: () => void;
}

const SUGGESTIONS = [
  '📅 Buy $50 of Bitcoin every Monday',
  '📉 Buy more ETH if price drops 20%',
  '💰 Move my profits to savings automatically',
  '🛡️ Sell everything if my investment drops 40%',
];

type ToolResult =
  | { type: 'parsed_intent'; data: Record<string, unknown> }
  | { type: 'intent_saved'; intentId: string; summary: string }
  | { type: 'save_error'; error: string };

function ParsedCard({ data }: { data: Record<string, unknown> }) {
  const confidence = Math.round(((data.confidence as number) ?? 0) * 100);
  return (
    <div className="neo-card p-4 mt-2 animate-fade-in space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center">
          <Zap className="w-3 h-3" />
        </div>
        <span className="font-black text-sm">Here's what I understood</span>
        <span className={cn(
          'ml-auto text-xs font-black px-2 py-0.5 border-2 border-[#0A0A0A]',
          confidence >= 80 ? 'bg-[#00C853] text-white' : 'bg-[#F5E642]'
        )}>
          {confidence}% clear
        </span>
      </div>

      <div className="bg-[#F5E642] border-2 border-[#0A0A0A] p-3">
        <p className="font-black">{String(data.summary ?? '')}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {data.fromToken && <div><span className="font-bold text-[#0A0A0A]/50">FROM</span><p className="font-black">{String(data.fromToken)}</p></div>}
        {data.toToken && <div><span className="font-bold text-[#0A0A0A]/50">TO</span><p className="font-black">{String(data.toToken)}</p></div>}
        {data.amount && <div><span className="font-bold text-[#0A0A0A]/50">AMOUNT</span><p className="font-black">${String(data.amount)}</p></div>}
        {data.triggerValue && <div><span className="font-bold text-[#0A0A0A]/50">WHEN</span><p className="font-black">{String(data.triggerValue)}</p></div>}
      </div>

      {Array.isArray(data.warnings) && (data.warnings as string[]).length > 0 && (
        <div className="flex items-start gap-2 border-2 border-[#0A0A0A] bg-[#F5E642] p-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs font-bold space-y-0.5">
            {(data.warnings as string[]).map((w, i) => <p key={i}>{w}</p>)}
          </div>
        </div>
      )}
      <p className="text-xs font-bold text-[#0A0A0A]/50">
        Reply <span className="font-black text-[#0A0A0A]">"yes"</span> to activate, or tell me what to change.
      </p>
    </div>
  );
}

function SavedCard({ summary }: { summary: string }) {
  return (
    <div className="neo-card-yellow p-4 mt-2 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-black">Automation activated! 🚀</span>
      </div>
      <p className="text-sm font-bold text-[#0A0A0A]/70">{summary}</p>
      <p className="text-xs font-bold text-[#0A0A0A]/40 mt-1">You can pause or cancel this anytime from your dashboard.</p>
    </div>
  );
}

export function IntentChat({ userAddress, onIntentSaved }: IntentChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload } = useChat({
    api: '/api/chat',
    body: { userAddress },
    onFinish: (msg) => {
      if (typeof msg.content === 'string' && msg.content.includes('intent_saved')) onIntentSaved();
    },
  });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center gap-5">
            <div className="neo-card-yellow p-5 text-center">
              <p className="text-3xl mb-2">💬</p>
              <p className="font-black text-lg">What do you want to automate?</p>
              <p className="text-sm font-medium text-[#0A0A0A]/60 mt-1">
                Describe it in plain English — no crypto knowledge needed.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-[#0A0A0A]/40">Try one of these:</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s.replace(/^[\S]+\s/, ''))}
                  className="w-full text-left neo-card-hover p-3 text-sm font-bold flex items-center gap-2"
                >
                  <span>{s.split(' ')[0]}</span>
                  <span>{s.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id}>
                {message.content && (
                  <div className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    <div className={message.role === 'user' ? 'chat-user' : 'chat-ai'}>
                      {message.content}
                    </div>
                  </div>
                )}
                {message.toolInvocations?.map((tool) => {
                  if (tool.state !== 'result') return null;
                  const result = tool.result as ToolResult;
                  if (result.type === 'parsed_intent') return <ParsedCard key={tool.toolCallId} data={result.data} />;
                  if (result.type === 'intent_saved') return <SavedCard key={tool.toolCallId} summary={result.summary} />;
                  return null;
                })}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="chat-ai flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <div className="border-t-2 border-[#0A0A0A] p-4 space-y-2 bg-white">
        {messages.length > 0 && !isLoading && (
          <button onClick={() => reload()} className="flex items-center gap-1 text-xs font-bold text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors">
            <RotateCcw className="w-3 h-3" /> Retry
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder="Tell me what you want to automate… (Enter to send)"
            disabled={isLoading}
            rows={2}
            className="neo-input flex-1 resize-none text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="neo-btn px-4 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
