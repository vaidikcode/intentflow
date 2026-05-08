import Link from 'next/link';
import { ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const EXAMPLES = [
  'Buy $50 of ETH every Monday at 9am',
  'Sell half my ETH if it drops 20% in 24 hours',
  'Swap USDC to ETH when price dips below $2,500',
  'Move staking rewards to cold wallet when gas < 15 gwei',
  'Transfer 10% of ETH to savings on the 1st of each month',
];

const STEPS = [
  { n: '01', title: 'Describe in English', body: 'Tell the AI what you want to automate. No code, no forms — just plain language.' },
  { n: '02', title: 'AI parses & confirms', body: 'Claude 3.5 Sonnet structures your intent and shows exactly what will happen.' },
  { n: '03', title: 'Activated on-chain', body: 'Your intent is hashed and registered on Base. It executes automatically when conditions are met.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="font-semibold text-sm">IntentFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/vaidikcode/intentflow"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <Button asChild size="sm">
              <Link href="/dashboard">Launch app</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-4xl mx-auto w-full">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground mb-10 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
          Web3 × AI Hackathon 2026 · Base Sepolia
        </div>

        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6 leading-none">
          DeFi automation,<br />
          <span className="text-muted-foreground">in plain English.</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
          Write what you want. Claude AI parses it. Smart contracts execute it on-chain —
          automatically, verifiably, without a single line of code.
        </p>

        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard" className="gap-2">
              Start automating <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="https://github.com/vaidikcode/intentflow" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Examples */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-mono text-muted-foreground mb-4 text-center uppercase tracking-widest">
            Example intents
          </p>
          <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-mono">{ex}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono text-muted-foreground mb-10 text-center uppercase tracking-widest">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, body }) => (
              <div key={n} className="space-y-3">
                <span className="text-xs font-mono text-muted-foreground">{n}</span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Stack */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {['Next.js 14', 'Vercel AI SDK', 'Claude 3.5 Sonnet', 'Supabase', 'Base Sepolia', 'shadcn/ui', 'Solidity'].map((t) => (
            <span key={t} className="text-xs font-mono text-muted-foreground">{t}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground font-mono">
        IntentFlow — Built for Web3 × AI Hackathon 2026
      </footer>
    </div>
  );
}
