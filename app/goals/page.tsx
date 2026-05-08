'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Zap, Wallet, ArrowLeft } from 'lucide-react';
import { GoalCreator } from '@/components/GoalCreator';

export default function GoalsPage() {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Nav */}
      <nav className="border-b-2 border-[#0A0A0A] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1.5 font-bold text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="w-px h-5 bg-[#0A0A0A]/20" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center shadow-neo-sm">
                <Zap className="w-4 h-4" />
              </div>
              <span className="font-black text-xl">Set a Goal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-bold text-sm hidden sm:block hover:underline">
              My automations
            </Link>
            <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-6 py-8 gap-8">
        {/* Left — explainer */}
        <div className="md:w-80 shrink-0 space-y-5">
          <div className="neo-card-yellow p-6">
            <p className="text-3xl mb-3">🎯</p>
            <h1 className="font-black text-2xl leading-tight mb-2">
              Tell us your goal.<br />We'll automate everything.
            </h1>
            <p className="font-medium text-[#0A0A0A]/70 text-sm leading-relaxed">
              Describe what you want to achieve with your money in plain English.
              Our AI builds a complete plan with multiple automations working together.
            </p>
          </div>

          <div className="neo-card p-5 space-y-4">
            <p className="font-black text-sm uppercase tracking-widest text-[#0A0A0A]/40">Example goals</p>
            {[
              '"Save $5,000 by end of year"',
              '"Invest $100 a week"',
              '"Buy the dip automatically"',
              '"Take profits when I\'m up 50%"',
            ].map((g) => (
              <p key={g} className="text-sm font-bold text-[#0A0A0A]/70 border-l-4 border-[#F5E642] pl-3">{g}</p>
            ))}
          </div>

          <div className="neo-card p-5">
            <p className="font-black text-sm mb-2">🔒 Always in your control</p>
            <p className="text-sm font-medium text-[#0A0A0A]/60 leading-relaxed">
              Your money stays in your wallet. Pause or cancel any automation instantly from your dashboard.
            </p>
          </div>
        </div>

        {/* Right — chat */}
        <div className="flex-1 neo-card overflow-hidden" style={{ height: 'calc(100vh - 160px)', minHeight: '500px' }}>
          {!isConnected ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-6">
              <div className="w-16 h-16 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center shadow-neo">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <h2 className="font-black text-2xl mb-2">Connect your wallet first</h2>
                <p className="font-medium text-[#0A0A0A]/60 max-w-xs">
                  We need your wallet to save and run your automations.
                </p>
              </div>
              <ConnectButton />
              <p className="text-xs font-bold text-[#0A0A0A]/40">
                Test network only — no real money involved
              </p>
            </div>
          ) : (
            <GoalCreator
              userAddress={address!}
              onGoalSaved={() => setRefreshKey(k => k + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
