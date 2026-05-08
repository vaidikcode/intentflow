'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-background" />
          </div>
          <span className="font-semibold text-sm tracking-tight">IntentFlow</span>
          <span className="text-[10px] border border-border text-muted-foreground px-1.5 py-0.5 rounded font-mono">
            BETA
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <a
            href="https://github.com/vaidikcode/intentflow"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://sepolia.basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Explorer
          </a>
        </nav>

        {/* Wallet */}
        <ConnectButton accountStatus="address" chainStatus="none" showBalance={false} />
      </div>
      <Separator />
    </header>
  );
}
