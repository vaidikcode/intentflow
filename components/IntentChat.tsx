'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';
import { Send, Loader2, Zap, Bot, User, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface IntentChatProps {
  userAddress: string;
  onIntentSaved: () => void;
}

const SUGGESTIONS = [
  'Buy $50 of ETH every Monday at 9am',
  'Sell half my ETH if price drops 20% in 24h',
  'Swap all USDC to ETH when price dips below $2,500',
  'Move staking rewards to cold wallet when gas < 15 gwei',
];

type ToolResult =
  | { type: 'parsed_intent'; data: Record<string, unknown> }
  | { type: 'intent_saved'; intentId: string; summary: string }
  | { type: 'save_error'; error: string };

function ParsedIntentCard({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="border border-border rounded-lg p-4 mt-2 space-y-3 bg-background animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
          <Zap className="w-3 h-3 text-background" />
        </div>
        <span className="text-sm font-medium">Parsed Intent</span>
        <Badge variant="outline" className="ml-auto text-[10px] font-mono">
          {Math.round(((data.confidence as number) ?? 0) * 100)}% confidence
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div>
          <span className="text-muted-foreground">Action</span>
          <p className="font-mono font-medium mt-0.5">{String(data.action ?? '—')}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Trigger</span>
          <p className="font-mono font-medium mt-0.5">{String(data.trigger ?? '—')}</p>
        </div>
        {data.fromToken && (
          <div>
            <span className="text-muted-foreground">From</span>
            <p className="font-mono font-medium mt-0.5">{String(data.fromToken)}</p>
          </div>
        )}
        {data.toToken && (
          <div>
            <span className="text-muted-foreground">To</span>
            <p className="font-mono font-medium mt-0.5">{String(data.toToken)}</p>
          </div>
        )}
        {data.amount && (
          <div>
            <span className="text-muted-foreground">Amount</span>
            <p className="font-mono font-medium mt-0.5">
              {String(data.amount)} ({String(data.amountType ?? 'fixed')})
            </p>
          </div>
        )}
        {data.triggerValue && (
          <div>
            <span className="text-muted-foreground">Trigger value</span>
            <p className="font-mono font-medium mt-0.5">{String(data.triggerValue)}</p>
          </div>
        )}
      </div>

      {Array.isArray(data.warnings) && data.warnings.length > 0 && (
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md p-2.5">
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <ul className="space-y-0.5">
            {(data.warnings as string[]).map((w: string, i: number) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Reply <span className="font-mono font-medium text-foreground">"yes"</span> to activate, or describe changes.
      </p>
    </div>
  );
}

function SavedIntentCard({ summary, intentId }: { summary: string; intentId: string }) {
  return (
    <div className="border border-border rounded-lg p-4 mt-2 bg-background animate-fade-in">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" />
        <span className="text-sm font-medium">Intent Activated</span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">{summary}</p>
      <p className="text-[10px] font-mono text-muted-foreground mt-1">ID: {intentId.slice(0, 8)}…</p>
    </div>
  );
}

export function IntentChat({ userAddress, onIntentSaved }: IntentChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, reload } = useChat({
    api: '/api/chat',
    body: { userAddress },
    onFinish: (message) => {
      // Check if a saveIntent tool was called → refresh intent list
      if (message.content && message.content.toString().includes('intent_saved')) {
        onIntentSaved();
      }
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 py-8 text-center">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
              <Bot className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Describe your automation</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Tell me what you want to automate in plain English. I'll parse it and deploy it on-chain.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-left text-xs border border-border rounded-lg px-3 py-2 hover:bg-muted transition-colors font-mono"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {/* Text content */}
                {message.content && (
                  <div
                    className={cn(
                      'flex items-start gap-2.5',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full border border-border flex items-center justify-center shrink-0 mt-0.5',
                      message.role === 'user' ? 'bg-foreground' : 'bg-background'
                    )}>
                      {message.role === 'user'
                        ? <User className="w-3 h-3 text-background" />
                        : <Bot className="w-3 h-3 text-foreground" />
                      }
                    </div>
                    <div className={cn(
                      'rounded-xl px-3.5 py-2.5 text-sm max-w-[80%]',
                      message.role === 'user'
                        ? 'bg-foreground text-background rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm'
                    )}>
                      {message.content}
                    </div>
                  </div>
                )}

                {/* Tool results */}
                {message.toolInvocations?.map((tool) => {
                  if (tool.state !== 'result') return null;
                  const result = tool.result as ToolResult;

                  if (result.type === 'parsed_intent') {
                    return (
                      <div key={tool.toolCallId} className="ml-8">
                        <ParsedIntentCard data={result.data} />
                      </div>
                    );
                  }
                  if (result.type === 'intent_saved') {
                    return (
                      <div key={tool.toolCallId} className="ml-8">
                        <SavedIntentCard summary={result.summary} intentId={result.intentId} />
                      </div>
                    );
                  }
                  if (result.type === 'save_error') {
                    return (
                      <div key={tool.toolCallId} className="ml-8 mt-2 text-xs text-red-600 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Error: {result.error}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-muted rounded-xl rounded-tl-sm px-3.5 py-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      <Separator />

      {/* Input */}
      <div className="p-4 space-y-2">
        {messages.length > 0 && !isLoading && (
          <button
            onClick={() => reload()}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Retry last message
          </button>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2"
        >
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder="Describe your intent… (↵ to send, Shift+↵ for newline)"
            disabled={isLoading}
            rows={2}
            className="resize-none flex-1 font-mono text-xs"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="shrink-0 h-[62px] w-9">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        <p className="text-[10px] text-muted-foreground text-right font-mono">
          Base Sepolia · Claude 3.5 Sonnet
        </p>
      </div>
    </div>
  );
}
