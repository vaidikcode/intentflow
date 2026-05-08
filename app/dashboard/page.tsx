'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Wallet, ArrowRight, ExternalLink } from 'lucide-react';
import { Header } from '@/components/Header';
import { IntentChat } from '@/components/IntentChat';
import { IntentList } from '@/components/IntentList';
import { StatsBar } from '@/components/StatsBar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Intent } from '@/types/intent';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [panel, setPanel] = useState<'chat' | 'intents'>('chat');

  useEffect(() => {
    if (!address) return;
    fetch(`/api/intents?address=${address}`)
      .then((r) => r.json())
      .then((d) => setIntents(d.intents ?? []));
  }, [address, refreshKey]);

  const onIntentSaved = () => setRefreshKey((k) => k + 1);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Mobile panel toggle */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background flex">
        <button
          className={cn(
            'flex-1 py-3 text-xs font-medium transition-colors',
            panel === 'chat' ? 'text-foreground' : 'text-muted-foreground'
          )}
          onClick={() => setPanel('chat')}
        >
          Chat
        </button>
        <Separator orientation="vertical" className="h-auto" />
        <button
          className={cn(
            'flex-1 py-3 text-xs font-medium transition-colors',
            panel === 'intents' ? 'text-foreground' : 'text-muted-foreground'
          )}
          onClick={() => setPanel('intents')}
        >
          Intents {intents.length > 0 && `(${intents.length})`}
        </button>
      </div>

      <main className="pt-14 flex-1 flex flex-col">
        {!isConnected ? (
          /* ── Not connected ── */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-6">
              <Wallet className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Connect your wallet</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-xs">
              Connect to create and manage on-chain intent automations. Base Sepolia testnet — no real funds required.
            </p>
            <ConnectButton />
          </div>
        ) : (
          /* ── Connected ── */
          <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
            {/* Left: Chat */}
            <div
              className={cn(
                'flex flex-col border-r border-border',
                'md:w-[480px] md:flex md:flex-col',
                panel === 'chat' ? 'flex flex-col flex-1' : 'hidden md:flex',
                'h-[calc(100vh-56px)]'
              )}
            >
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-border shrink-0">
                <p className="text-xs font-medium">New Intent</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                  Powered by Claude 3.5 Sonnet · Vercel AI SDK
                </p>
              </div>

              {/* Chat body */}
              <div className="flex-1 overflow-hidden">
                <IntentChat userAddress={address!} onIntentSaved={onIntentSaved} />
              </div>
            </div>

            {/* Right: Intents + stats */}
            <div
              className={cn(
                'flex-1 flex flex-col overflow-y-auto',
                panel === 'intents' ? 'flex' : 'hidden md:flex',
                'pb-16 md:pb-0'
              )}
            >
              {/* Wallet info bar */}
              <div className="px-6 py-3 border-b border-border flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-foreground shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground truncate">{address}</span>
                </div>
                <a
                  href={`https://sepolia.basescan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0"
                >
                  BaseScan <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Stats */}
              <div className="px-6 pt-4 pb-2 shrink-0">
                <StatsBar intents={intents} />
              </div>

              {/* Intent list */}
              <div className="px-6 py-4 flex-1">
                <IntentList userAddress={address!} refreshKey={refreshKey} />
              </div>

              {/* Footer links */}
              <div className="px-6 py-4 border-t border-border shrink-0 flex items-center gap-4 text-xs text-muted-foreground font-mono">
                <a href="https://github.com/vaidikcode/intentflow" target="_blank" rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1">
                  GitHub <ArrowRight className="w-3 h-3" />
                </a>
                <a href="https://sepolia.basescan.org" target="_blank" rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1">
                  Explorer <ArrowRight className="w-3 h-3" />
                </a>
                <span className="ml-auto">Base Sepolia</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
