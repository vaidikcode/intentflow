'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect, useState } from 'react';
import { Send, Loader2, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCreatorProps {
  userAddress: string;
  onGoalSaved: () => void;
}

const GOAL_PROMPTS = [
  '💰 Save $5,000 in Bitcoin by end of year',
  '📅 Invest $100 a week automatically',
  '📉 Buy more whenever prices drop',
  '🎯 Build a $10,000 emergency crypto fund',
  '🚀 Grow my savings 20% this year',
];

type GoalPlan = {
  goalSummary: string;
  timeframe?: string;
  totalAmount?: string;
  weeklyAmount?: string;
  automations: Array<{
    emoji: string;
    title: string;
    description: string;
    frequency: string;
    action: string;
    amount?: string;
    trigger: string;
  }>;
  encouragement: string;
};

type ToolResult =
  | { type: 'goal_plan'; plan: GoalPlan }
  | { type: 'goal_saved'; count: number; goalSummary: string }
  | { type: 'error'; message: string };

function GoalPlanCard({ plan, onConfirm }: { plan: GoalPlan; onConfirm: () => void }) {
  return (
    <div className="neo-card p-5 mt-3 animate-fade-in space-y-4">
      {/* Header */}
      <div className="bg-[#F5E642] border-2 border-[#0A0A0A] p-4 -mx-1">
        <p className="text-xs font-black uppercase tracking-widest text-[#0A0A0A]/60 mb-1">Your Goal</p>
        <p className="font-black text-lg leading-snug">{plan.goalSummary}</p>
        {plan.weeklyAmount && (
          <p className="text-sm font-bold mt-1 text-[#0A0A0A]/70">
            That's just {plan.weeklyAmount} per week 🎯
          </p>
        )}
      </div>

      {/* Automations */}
      <div className="space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-[#0A0A0A]/50">
          Your {plan.automations.length} automations
        </p>
        {plan.automations.map((a, i) => (
          <div key={i} className="flex items-start gap-3 border-2 border-[#0A0A0A] p-3 bg-white shadow-neo-sm">
            <span className="text-xl shrink-0">{a.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm">{a.title}</p>
              <p className="text-xs font-medium text-[#0A0A0A]/60 mt-0.5">{a.description}</p>
              <p className="text-xs font-bold text-[#0A0A0A]/40 mt-0.5">⏱ {a.trigger}</p>
            </div>
            {a.amount && (
              <span className="neo-tag-yellow text-xs shrink-0">{a.amount}</span>
            )}
          </div>
        ))}
      </div>

      {/* Encouragement */}
      <p className="text-sm font-bold text-[#0A0A0A]/70 italic">"{plan.encouragement}"</p>

      {/* Confirm */}
      <button
        onClick={onConfirm}
        className="neo-btn-yellow w-full flex items-center justify-center gap-2 py-3"
      >
        <Zap className="w-4 h-4" />
        Activate all {plan.automations.length} automations
      </button>
      <p className="text-xs font-medium text-center text-[#0A0A0A]/40">
        You can pause or cancel any of these anytime
      </p>
    </div>
  );
}

function GoalSavedCard({ count, goalSummary }: { count: number; goalSummary: string }) {
  return (
    <div className="neo-card-yellow p-5 mt-3 animate-fade-in text-center">
      <div className="w-12 h-12 bg-[#0A0A0A] border-2 border-[#0A0A0A] flex items-center justify-center mx-auto mb-3">
        <CheckCircle2 className="w-6 h-6 text-[#F5E642]" />
      </div>
      <p className="font-black text-xl mb-1">You're on autopilot! 🚀</p>
      <p className="font-bold text-[#0A0A0A]/70 mb-3">{count} automations are now running for your goal:</p>
      <p className="font-black">{goalSummary}</p>
    </div>
  );
}

export function GoalCreator({ userAddress, onGoalSaved }: GoalCreatorProps) {
  const [pendingPlan, setPendingPlan] = useState<GoalPlan | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } = useChat({
    api: '/api/goals',
    body: { userAddress },
    onFinish: (msg) => {
      if (typeof msg.content === 'string' && msg.content.includes('goal_saved')) {
        onGoalSaved();
      }
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConfirmPlan = () => {
    if (!pendingPlan) return;
    setPendingPlan(null);
    append({
      role: 'user',
      content: 'Yes! Activate all of these automations for me.',
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center space-y-6">
            <div className="neo-card-yellow p-6 text-center">
              <p className="text-3xl mb-3">🎯</p>
              <h2 className="font-black text-2xl mb-2">What's your goal?</h2>
              <p className="font-medium text-[#0A0A0A]/70 text-sm">
                Tell us what you want to achieve with your money. We'll build a complete plan and automate everything.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-[#0A0A0A]/40">Try one of these:</p>
              {GOAL_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p.replace(/^[\S]+\s/, ''))}
                  className="w-full text-left neo-card p-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all text-sm font-bold flex items-center gap-2"
                >
                  <span>{p.split(' ')[0]}</span>
                  <span>{p.split(' ').slice(1).join(' ')}</span>
                  <ArrowRight className="w-3 h-3 ml-auto shrink-0 text-[#0A0A0A]/40" />
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

                  if (result.type === 'goal_plan') {
                    if (!pendingPlan) setPendingPlan(result.plan);
                    return (
                      <GoalPlanCard
                        key={tool.toolCallId}
                        plan={result.plan}
                        onConfirm={handleConfirmPlan}
                      />
                    );
                  }
                  if (result.type === 'goal_saved') {
                    return (
                      <GoalSavedCard
                        key={tool.toolCallId}
                        count={result.count}
                        goalSummary={result.goalSummary}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="chat-ai flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Building your plan…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t-2 border-[#0A0A0A] p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            placeholder="Describe your financial goal…"
            disabled={isLoading}
            rows={2}
            className="neo-input flex-1 resize-none text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="neo-btn px-4 disabled:opacity-40 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
