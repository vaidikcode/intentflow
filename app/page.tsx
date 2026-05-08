import Link from 'next/link';
import { ArrowRight, Zap, Star } from 'lucide-react';

const EXAMPLES = [
  { emoji: '📅', text: 'Buy $50 of Bitcoin every Monday morning' },
  { emoji: '📉', text: 'Buy more ETH if the price drops 15%' },
  { emoji: '💰', text: 'Move my profits to safe savings automatically' },
  { emoji: '⏰', text: 'Save $200 to crypto on the 1st of every month' },
  { emoji: '🎯', text: 'Sell half if my investment doubles in value' },
];

const FEATURES = [
  {
    emoji: '🗣️',
    title: 'Just say what you want',
    body: 'No confusing forms. No technical setup. Just describe what you want to happen with your money — in plain English.',
  },
  {
    emoji: '🤖',
    title: 'AI does the heavy lifting',
    body: 'Our AI understands exactly what you mean, builds the automation, and double-checks everything before asking for your approval.',
  },
  {
    emoji: '✅',
    title: 'It just happens',
    body: 'Once you say go, your automation runs itself. Buy the dip, take profits, save regularly — all without you lifting a finger.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Nav */}
      <nav className="border-b-2 border-[#0A0A0A] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center shadow-neo-sm">
              <Zap className="w-4 h-4 text-[#0A0A0A]" />
            </div>
            <span className="font-black text-xl tracking-tight">AutoPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/how-it-works" className="font-bold text-sm hidden sm:block hover:underline underline-offset-4">
              How it works
            </Link>
            <Link href="/goals" className="font-bold text-sm hidden sm:block hover:underline underline-offset-4">
              Set a Goal
            </Link>
            <Link href="/dashboard" className="neo-btn text-sm">
              Open App →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 neo-card px-3 py-1.5 mb-8">
            <Star className="w-3.5 h-3.5 fill-[#F5E642] text-[#F5E642]" />
            <span className="text-xs font-bold uppercase tracking-widest">AI-Powered Money Automation</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-none mb-8 tracking-tight">
            Put your<br />
            <span className="bg-[#F5E642] px-2 inline-block border-2 border-[#0A0A0A] shadow-neo">money</span><br />
            on autopilot.
          </h1>

          <p className="text-xl font-medium text-[#0A0A0A]/70 mb-10 max-w-xl leading-relaxed">
            Tell us what you want to do with your money. In plain English.
            We'll set it up and run it automatically — no tech skills needed.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="neo-btn-yellow text-base px-8 py-3 flex items-center gap-2">
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/how-it-works" className="neo-btn-outline text-base px-8 py-3">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Example ticker */}
      <section className="border-y-2 border-[#0A0A0A] bg-[#F5E642] py-4 overflow-hidden">
        <div className="flex gap-12 animate-none">
          <div className="flex gap-12 whitespace-nowrap">
            {[...EXAMPLES, ...EXAMPLES].map((ex, i) => (
              <span key={i} className="text-sm font-bold flex items-center gap-2">
                <span>{ex.emoji}</span>
                <span>&ldquo;{ex.text}&rdquo;</span>
                <span className="text-[#0A0A0A]/40">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Example box */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="neo-tag-yellow mb-4">Example</p>
            <h2 className="text-4xl font-black mb-4 leading-tight">
              Just type what<br />you want.
            </h2>
            <p className="text-[#0A0A0A]/70 font-medium leading-relaxed">
              No spreadsheets. No crypto expertise. No confusing buttons.
              Just describe your goal like you're texting a friend.
            </p>
          </div>

          <div className="neo-card p-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A]/50">You type:</p>
            <div className="bg-[#F5E642] border-2 border-[#0A0A0A] p-4 font-bold text-lg leading-snug">
              "Buy $100 of Bitcoin every Friday, and sell automatically if it drops 25%"
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-[#0A0A0A]" />
              <span className="text-xs font-bold">AI understands this instantly</span>
              <div className="h-0.5 flex-1 bg-[#0A0A0A]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 border-2 border-[#0A0A0A] p-3 bg-white">
                <span className="text-lg">📅</span>
                <span className="text-sm font-bold">Buy $100 Bitcoin every Friday</span>
                <span className="ml-auto neo-tag-green text-[10px]">RUNNING</span>
              </div>
              <div className="flex items-center gap-2 border-2 border-[#0A0A0A] p-3 bg-white">
                <span className="text-lg">🛡️</span>
                <span className="text-sm font-bold">Sell if value drops 25%</span>
                <span className="ml-auto neo-tag-green text-[10px]">WATCHING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t-2 border-[#0A0A0A] bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="neo-tag-black mb-4">How it works</p>
          <h2 className="text-4xl font-black mb-12">Three steps.<br />That's it.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ emoji, title, body }, i) => (
              <div key={i} className="neo-card p-6">
                <div className="w-12 h-12 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center text-2xl mb-4 shadow-neo-sm">
                  {emoji}
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-[#0A0A0A]/50 mb-2">
                  Step {i + 1}
                </p>
                <h3 className="text-xl font-black mb-2">{title}</h3>
                <p className="text-sm font-medium text-[#0A0A0A]/70 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Feature CTA — Goals */}
      <section className="border-t-2 border-[#0A0A0A] bg-[#0A0A0A] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <p className="neo-tag bg-[#F5E642] text-[#0A0A0A] mb-4 border-[#F5E642]">NEW ✨</p>
            <h2 className="text-4xl font-black mb-4 leading-tight">
              Tell us your goal.<br />We'll build a whole plan.
            </h2>
            <p className="text-white/70 font-medium leading-relaxed mb-6">
              Say "I want to save $5,000 in crypto by end of year" and our AI creates
              a complete, personalised automation plan — buying schedules, safety nets,
              profit-taking rules — all set up automatically.
            </p>
            <Link href="/goals" className="neo-btn-yellow inline-flex items-center gap-2 text-base px-8 py-3">
              Set my goal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="neo-card-yellow p-6 w-full max-w-sm shadow-[6px_6px_0px_#F5E642]">
            <p className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A]/60 mb-3">Your goal:</p>
            <p className="font-black text-xl mb-4">"Save $5,000 in Bitcoin by December"</p>
            <div className="space-y-2">
              {['Buy $96 every week automatically', 'Pause if Bitcoin drops 30%', 'Take profits when up 50%', 'Weekly progress report'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border-2 border-[#0A0A0A] p-2.5">
                  <span className="text-[#00C853] font-black">✓</span>
                  <span className="text-sm font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t-2 border-[#0A0A0A] py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-4">Ready to start?</h2>
          <p className="text-[#0A0A0A]/70 font-medium mb-8 text-lg">
            Takes 60 seconds. No credit card. No crypto experience needed.
          </p>
          <Link href="/dashboard" className="neo-btn-yellow text-lg px-10 py-4 inline-flex items-center gap-2">
            Start automating <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#0A0A0A] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-bold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center">
              <Zap className="w-3 h-3" />
            </div>
            <span>AutoPilot</span>
          </div>
          <div className="flex items-center gap-6 text-[#0A0A0A]/60">
            <Link href="/how-it-works" className="hover:text-[#0A0A0A] transition-colors">How it works</Link>
            <Link href="/goals" className="hover:text-[#0A0A0A] transition-colors">Goals</Link>
            <Link href="/dashboard" className="hover:text-[#0A0A0A] transition-colors">Dashboard</Link>
            <a href="https://github.com/vaidikcode/intentflow" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A0A0A] transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
