'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Wallet, Zap, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { IntentChat } from '@/components/IntentChat';
import { IntentList } from '@/components/IntentList';
import { StatsBar } from '@/components/StatsBar';
import { cn } from '@/lib/utils';
import type { Intent } from '@/types/intent';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [panel, setPanel] = useState<'chat' | 'automations'>('chat');

  useEffect(() => {
    if (!address) return;
    fetch(`/api/intents?address=${address}`)
      .then(r => r.json())
      .then(d => setIntents(d.intents ?? []));
  }, [address, refreshKey]);

  const onIntentSaved = () => setRefreshKey(k => k + 1);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Header />

      {/* Mobile tab switcher */}
      <div className="md:hidden border-b-2 border-[#0A0A0A] bg-white flex">
        {(['chat', 'automations'] as const).map((p, i) => (
          <button
            key={p}
            onClick={() => setPanel(p)}
            className={cn(
              'flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors',
              i === 0 && 'border-r-2 border-[#0A0A0A]',
              panel === p ? 'bg-[#0A0A0A] text-white' : 'hover:bg-[#F5E642]'
            )}
          >
            {p === 'chat' ? '💬 New automation' : `📋 Mine (${intents.length})`}
          </button>
        ))}
      </div>

      <main className="flex-1 flex flex-col">
        {!isConnected ? (
          /* Not connected */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-8">
            <div className="neo-card-yellow p-10 max-w-md w-full">
              <div className="w-16 h-16 bg-[#0A0A0A] border-2 border-[#0A0A0A] flex items-center justify-center mx-auto mb-6 shadow-neo">
                <Wallet className="w-8 h-8 text-[#F5E642]" />
              </div>
              <h1 className="font-black text-3xl mb-3">Connect your wallet</h1>
              <p className="font-medium text-[#0A0A0A]/70 mb-8 leading-relaxed">
                Connect to start setting up automations. Your money stays in your wallet — we just run the rules you set.
              </p>
              <ConnectButton />
              <p className="text-xs font-bold text-[#0A0A0A]/40 mt-4">
                Test network — no real money required
              </p>
            </div>

            <div className="flex gap-4 text-sm font-bold">
              <Link href="/how-it-works" className="flex items-center gap-1 hover:underline underline-offset-4">
                How it works <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/goals" className="flex items-center gap-1 hover:underline underline-offset-4">
                Set a goal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Connected — split pane */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
            {/* Left: Chat */}
            <div className={cn(
              'flex flex-col border-r-2 border-[#0A0A0A]',
              'md:w-[440px] md:flex',
              panel === 'chat' ? 'flex flex-col flex-1 md:flex-none' : 'hidden md:flex'
            )}>
              {/* Chat header */}
              <div className="border-b-2 border-[#0A0A0A] px-5 py-3 bg-white flex items-center justify-between shrink-0">
                <div>
                  <p className="font-black text-sm">New Automation</p>
                  <p className="text-xs font-medium text-[#0A0A0A]/50">Tell me what you want to happen</p>
                </div>
                <Link href="/goals" className="neo-btn-yellow text-xs px-3 py-1.5 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Set a goal
                </Link>
              </div>
              <div className="flex-1 overflow-hidden bg-[#FAFAFA]">
                <IntentChat userAddress={address!} onIntentSaved={onIntentSaved} />
              </div>
            </div>

            {/* Right: Automations */}
            <div className={cn(
              'flex-1 flex flex-col overflow-y-auto bg-white',
              panel === 'automations' ? 'flex' : 'hidden md:flex'
            )}>
              {/* Wallet bar */}
              <div className="border-b-2 border-[#0A0A0A] px-6 py-3 flex items-center gap-3 shrink-0 bg-[#0A0A0A] text-white">
                <span className="w-2 h-2 rounded-full bg-[#00C853] shrink-0" />
                <span className="text-xs font-mono font-bold truncate flex-1">{address}</span>
                <span className="text-xs font-bold text-white/50 shrink-0">Test Network</span>
              </div>

              {/* Stats */}
              <div className="px-6 pt-6 pb-3 shrink-0">
                <StatsBar intents={intents} />
              </div>

              {/* Goal promo (if no intents) */}
              {intents.length === 0 && (
                <div className="mx-6 mb-4">
                  <Link href="/goals" className="neo-card-yellow p-4 flex items-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm transition-all block">
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1">
                      <p className="font-black text-sm">Have a savings goal?</p>
                      <p className="text-xs font-medium text-[#0A0A0A]/60">Tell us and we'll build the whole plan automatically</p>
                    </div>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              )}

              {/* Intent list */}
              <div className="px-6 pb-8 flex-1">
                <IntentList userAddress={address!} refreshKey={refreshKey} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
