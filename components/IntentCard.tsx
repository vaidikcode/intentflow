'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Pause, ArrowLeftRight, TrendingDown, TrendingUp, Repeat, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Intent } from '@/types/intent';

interface IntentCardProps {
  intent: Intent;
  onCancel: (id: string) => void;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  swap: <ArrowLeftRight className="w-4 h-4" />,
  buy: <TrendingUp className="w-4 h-4" />,
  sell: <TrendingDown className="w-4 h-4" />,
  transfer: <Zap className="w-4 h-4" />,
  stake: <Repeat className="w-4 h-4" />,
};

// Plain English status labels — zero jargon
const STATUS_LABEL: Record<string, string> = {
  active: 'RUNNING',
  pending: 'SCHEDULED',
  executed: 'DONE',
  failed: 'FAILED',
  cancelled: 'PAUSED',
};
const STATUS_CLASS: Record<string, string> = {
  active: 'status-running',
  pending: 'status-scheduled',
  executed: 'status-done',
  failed: 'status-failed',
  cancelled: 'status-paused',
};

export function IntentCard({ intent, onCancel }: IntentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await fetch(`/api/intents/${intent.id}`, { method: 'DELETE' });
      onCancel(intent.id);
    } finally {
      setCancelling(false);
    }
  };

  const created = new Date(intent.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <div className="neo-card-hover p-4 animate-fade-in">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center shrink-0 shadow-neo-sm mt-0.5">
            {ACTION_ICONS[intent.parsed.action] ?? <Zap className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm leading-snug truncate">{intent.parsed.summary}</p>
            <p className="text-xs font-medium text-[#0A0A0A]/50 mt-0.5 truncate">{intent.raw_text}</p>
          </div>
        </div>
        <span className={cn('shrink-0 neo-tag text-[10px]', STATUS_CLASS[intent.status] ?? 'status-scheduled')}>
          {STATUS_LABEL[intent.status] ?? 'SCHEDULED'}
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-3 text-xs font-bold text-[#0A0A0A]/40">
        <span>Set up {created}</span>
        {intent.execution_count > 0 && (
          <span className="bg-[#F5E642] border border-[#0A0A0A] px-1.5 py-0.5 text-[#0A0A0A]">
            ran {intent.execution_count}×
          </span>
        )}
        <span className="ml-auto">{Math.round(intent.parsed.confidence * 100)}% match</span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-[#0A0A0A]/10 border border-[#0A0A0A]/10">
        <div
          className="h-full bg-[#0A0A0A] transition-all"
          style={{ width: `${Math.round(intent.parsed.confidence * 100)}%` }}
        />
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="mt-3 pt-3 border-t-2 border-[#0A0A0A]/10 space-y-2 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {intent.parsed.fromToken && (
              <div className="border-2 border-[#0A0A0A] p-2 bg-white">
                <p className="font-bold text-[#0A0A0A]/40 uppercase">From</p>
                <p className="font-black">{intent.parsed.fromToken}</p>
              </div>
            )}
            {intent.parsed.toToken && (
              <div className="border-2 border-[#0A0A0A] p-2 bg-white">
                <p className="font-bold text-[#0A0A0A]/40 uppercase">To</p>
                <p className="font-black">{intent.parsed.toToken}</p>
              </div>
            )}
            {intent.parsed.amount && (
              <div className="border-2 border-[#0A0A0A] p-2 bg-white">
                <p className="font-bold text-[#0A0A0A]/40 uppercase">Amount</p>
                <p className="font-black">${intent.parsed.amount}</p>
              </div>
            )}
          </div>
          {intent.parsed.warnings && intent.parsed.warnings.length > 0 && (
            <div className="border-2 border-[#0A0A0A] bg-[#F5E642] p-2.5 text-xs font-bold">
              {intent.parsed.warnings.map((w, i) => <p key={i}>⚠ {w}</p>)}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-[#0A0A0A]/10">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs font-bold text-[#0A0A0A]/50 hover:text-[#0A0A0A] transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Less' : 'Details'}
        </button>
        {intent.status !== 'cancelled' && intent.status !== 'executed' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-1 text-xs font-bold text-[#0A0A0A]/50 hover:text-[#FF3B3B] transition-colors disabled:opacity-40"
          >
            <Pause className="w-3 h-3" />
            {cancelling ? 'Pausing…' : 'Pause'}
          </button>
        )}
      </div>
    </div>
  );
}
