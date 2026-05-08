'use client';

import { useState } from 'react';
import {
  ChevronDown, ChevronUp, X, ExternalLink, Clock,
  Repeat, ArrowLeftRight, TrendingDown, TrendingUp, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Intent } from '@/types/intent';

interface IntentCardProps {
  intent: Intent;
  onCancel: (id: string) => void;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  swap: <ArrowLeftRight className="w-3.5 h-3.5" />,
  buy: <TrendingUp className="w-3.5 h-3.5" />,
  sell: <TrendingDown className="w-3.5 h-3.5" />,
  transfer: <Zap className="w-3.5 h-3.5" />,
  stake: <Repeat className="w-3.5 h-3.5" />,
};

const TRIGGER_LABELS: Record<string, string> = {
  price_above: 'Price ↑',
  price_below: 'Price ↓',
  price_change_percent: 'Price Δ%',
  time_recurring: 'Recurring',
  time_once: 'One-time',
  gas_below: 'Gas ↓',
  manual: 'Manual',
  compound: 'Compound',
};

function StatusBadge({ status }: { status: Intent['status'] }) {
  const cls: Record<string, string> = {
    active: 'status-active',
    pending: 'status-pending',
    executed: 'status-executed',
    failed: 'status-failed',
    cancelled: 'status-cancelled',
  };
  return <span className={cn(cls[status] ?? 'status-pending')}>{status}</span>;
}

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
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const confidencePct = Math.round(intent.parsed.confidence * 100);

  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:border-foreground/20 transition-colors animate-fade-in">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="w-7 h-7 rounded border border-border flex items-center justify-center shrink-0 mt-0.5">
            {ACTION_ICONS[intent.parsed.action] ?? <Zap className="w-3.5 h-3.5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{intent.parsed.summary}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono truncate">{intent.raw_text}</p>
          </div>
        </div>
        <StatusBadge status={intent.status} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" />{created}
        </span>
        <span className="font-mono">
          {TRIGGER_LABELS[intent.parsed.trigger] ?? intent.parsed.trigger}
          {intent.parsed.triggerValue ? ` ${intent.parsed.triggerValue}` : ''}
        </span>
        {intent.execution_count > 0 && (
          <span className="flex items-center gap-1 font-mono">
            <Repeat className="w-3 h-3" />{intent.execution_count}×
          </span>
        )}
        <span className="ml-auto font-mono">{confidencePct}% conf.</span>
      </div>

      {/* Confidence bar */}
      <div className="mt-2.5 h-0.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground rounded-full transition-all"
          style={{ width: `${confidencePct}%` }}
        />
      </div>

      {/* Expanded */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['fromToken', 'toToken', 'amount', 'slippage'] as const).map((key) =>
              intent.parsed[key] != null ? (
                <div key={key}>
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <p className="font-mono font-medium mt-0.5">{String(intent.parsed[key])}</p>
                </div>
              ) : null
            )}
          </div>
          {intent.parsed.warnings && intent.parsed.warnings.length > 0 && (
            <div className="text-xs bg-amber-50 border border-amber-100 rounded-md p-2.5 text-amber-700">
              {intent.parsed.warnings.map((w, i) => <p key={i}>⚠ {w}</p>)}
            </div>
          )}
          {intent.on_chain_hash && (
            <a
              href={`https://sepolia.basescan.org/tx/${intent.on_chain_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-mono"
            >
              {intent.on_chain_hash.slice(0, 14)}…
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs gap-1 text-muted-foreground"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Collapse' : 'Details'}
        </Button>
        {intent.status !== 'cancelled' && intent.status !== 'executed' && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-destructive"
            onClick={handleCancel}
            disabled={cancelling}
          >
            <X className="w-3 h-3" />
            {cancelling ? 'Cancelling…' : 'Cancel'}
          </Button>
        )}
      </div>
    </div>
  );
}
