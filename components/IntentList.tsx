'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { IntentCard } from './IntentCard';
import type { Intent } from '@/types/intent';
import { cn } from '@/lib/utils';

interface IntentListProps {
  userAddress: string;
  refreshKey: number;
}

type Tab = 'running' | 'scheduled' | 'history';

export function IntentList({ userAddress, refreshKey }: IntentListProps) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('running');

  const load = useCallback(async () => {
    if (!userAddress) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/intents?address=${userAddress}`);
      const data = await res.json();
      if (res.ok) setIntents(data.intents ?? []);
    } finally {
      setLoading(false);
    }
  }, [userAddress]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const handleCancel = (id: string) => {
    setIntents(prev => prev.map(i => i.id === id ? { ...i, status: 'cancelled' as const } : i));
  };

  const groups: Record<Tab, Intent[]> = {
    running: intents.filter(i => i.status === 'active'),
    scheduled: intents.filter(i => i.status === 'pending'),
    history: intents.filter(i => ['executed', 'cancelled', 'failed'].includes(i.status)),
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'running', label: 'Running' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'history', label: 'History' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-black text-lg">My Automations</h2>
        <button
          onClick={load}
          disabled={loading}
          className="w-8 h-8 border-2 border-[#0A0A0A] flex items-center justify-center hover:bg-[#F5E642] transition-colors shadow-neo-sm"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-2 border-[#0A0A0A] shadow-neo overflow-hidden">
        {TABS.map(({ key, label }, i) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex-1 py-2 text-xs font-black uppercase tracking-widest transition-colors',
              i < 2 && 'border-r-2 border-[#0A0A0A]',
              tab === key ? 'bg-[#0A0A0A] text-white' : 'bg-white hover:bg-[#F5E642]'
            )}
          >
            {label}
            {groups[key].length > 0 && (
              <span className={cn(
                'ml-1.5 text-[10px] px-1.5 py-0.5 border border-current',
                tab === key ? 'border-white/40' : 'border-[#0A0A0A]/30'
              )}>
                {groups[key].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : groups[tab].length === 0 ? (
        <div className="border-2 border-dashed border-[#0A0A0A]/20 py-14 text-center">
          <p className="text-3xl mb-2">{tab === 'running' ? '😴' : tab === 'scheduled' ? '📅' : '📋'}</p>
          <p className="font-black text-sm text-[#0A0A0A]/40">
            {tab === 'running' ? 'No automations running yet' : tab === 'scheduled' ? 'Nothing scheduled' : 'No history yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups[tab].map(intent => (
            <IntentCard key={intent.id} intent={intent} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
}
