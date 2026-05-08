'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b-2 border-[#0A0A0A] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center shadow-neo-sm">
            <Zap className="w-4 h-4 text-[#0A0A0A]" />
          </div>
          <span className="font-black text-xl tracking-tight">AutoPilot</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
          <Link href="/dashboard" className="hover:underline underline-offset-4">My Automations</Link>
          <Link href="/goals" className="hover:underline underline-offset-4">Set a Goal</Link>
          <Link href="/how-it-works" className="hover:underline underline-offset-4">How it works</Link>
        </nav>

        <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
      </div>
    </header>
  );
}
