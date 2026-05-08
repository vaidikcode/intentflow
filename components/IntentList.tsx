'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, RefreshCw, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IntentCard } from './IntentCard';
import type { Intent } from '@/types/intent';

interface IntentListProps {
  userAddress: string;
  refreshKey: number;
}

export function IntentList({ userAddress, refreshKey }: IntentListProps) {
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(false);

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
    setIntents((prev) => prev.map((i) => i.id === id ? { ...i, status: 'cancelled' as const } : i));
  };

  const groups = {
    active: intents.filter((i) => i.status === 'active'),
    pending: intents.filter((i) => i.status === 'pending'),
    history: intents.filter((i) => i.status === 'executed' || i.status === 'cancelled' || i.status === 'failed'),
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Intents</span>
          <span className="text-xs font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
            {intents.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1 text-xs gap-1.5">
            Active
            {groups.active.length > 0 && (
              <span className="bg-foreground text-background rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {groups.active.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 text-xs gap-1.5">
            Pending
            {groups.pending.length > 0 && (
              <span className="bg-foreground text-background rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                {groups.pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-xs">History</TabsTrigger>
        </TabsList>

        {(['active', 'pending', 'history'] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-3 space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : groups[tab].length === 0 ? (
              <div className="border border-dashed border-border rounded-lg py-10 text-center">
                <p className="text-xs text-muted-foreground">No {tab} intents</p>
              </div>
            ) : (
              groups[tab].map((intent) => (
                <IntentCard key={intent.id} intent={intent} onCancel={handleCancel} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
