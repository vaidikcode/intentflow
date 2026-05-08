import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    emoji: '💬',
    title: 'Tell us what you want',
    description: 'Open the app and type what you want to happen with your money — exactly like you\'d tell a friend. No technical words needed.',
    example: '"Buy $50 of Bitcoin every Monday morning"',
    color: 'bg-[#F5E642]',
  },
  {
    number: '02',
    emoji: '🤖',
    title: 'AI figures out the details',
    description: 'Our AI reads what you wrote, understands exactly what you mean, and builds a precise plan. It shows you exactly what it understood before doing anything.',
    example: 'AI confirms: "Every Monday at 9am, buy $50 of Bitcoin at the best available price"',
    color: 'bg-white',
  },
  {
    number: '03',
    emoji: '✅',
    title: 'You approve it',
    description: 'Review what the AI built. If it looks right, hit confirm. If not, just tell it to change something — it\'ll adjust instantly.',
    example: '"Yes, that\'s right" or "Actually make it $100 instead"',
    color: 'bg-[#F5E642]',
  },
  {
    number: '04',
    emoji: '🚀',
    title: 'It runs automatically',
    description: 'Your automation is now live. It runs on its own — buying, selling, or saving exactly when you told it to. You can check in anytime, pause, or cancel.',
    example: 'Your dashboard shows: "Bought $50 Bitcoin — Monday 9:00am ✓"',
    color: 'bg-white',
  },
];

const FAQS = [
  {
    q: 'Do I need to know anything about crypto?',
    a: 'Not at all. You just describe what you want in plain English. AutoPilot handles everything else — the technical stuff happens invisibly in the background.',
  },
  {
    q: 'Is my money safe?',
    a: 'You stay in control at all times. Your money stays in your own wallet — we never hold it. Every automation is shown to you before it runs, and you can stop it any time.',
  },
  {
    q: 'What can I automate?',
    a: 'Buying on a schedule ("every Friday"), buying the dip ("buy more if price drops 20%"), taking profits ("sell 25% when I\'m up 50%"), regular savings, and much more.',
  },
  {
    q: 'What if I want to change or stop an automation?',
    a: 'Just go to your dashboard and hit Pause or Cancel. Or tell the AI "stop my Bitcoin purchases" — it\'ll handle it.',
  },
  {
    q: 'How is this different from just buying crypto manually?',
    a: 'Automating removes emotion from your decisions. You buy consistently (dollar-cost averaging), you don\'t panic-sell, and you never forget to follow your own plan.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Nav */}
      <nav className="border-b-2 border-[#0A0A0A] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F5E642] border-2 border-[#0A0A0A] flex items-center justify-center shadow-neo-sm">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-black text-xl">AutoPilot</span>
          </Link>
          <Link href="/dashboard" className="neo-btn text-sm">
            Open App →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="neo-tag-yellow mb-4">No tech skills needed</p>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none">
          How it works
        </h1>
        <p className="text-xl font-medium text-[#0A0A0A]/70 max-w-2xl mx-auto">
          Four simple steps from "I want to save money" to
          "my savings run themselves automatically."
        </p>
      </section>

      {/* Steps */}
      <section className="max-w-4xl mx-auto px-6 pb-20 space-y-6">
        {STEPS.map((step) => (
          <div key={step.number} className={`neo-card p-8 ${step.color}`}>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2 shrink-0">
                <span className="text-5xl font-black text-[#0A0A0A]/10">{step.number}</span>
                <span className="text-4xl">{step.emoji}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black mb-3">{step.title}</h2>
                <p className="font-medium text-[#0A0A0A]/70 leading-relaxed mb-4">{step.description}</p>
                <div className="bg-white border-2 border-[#0A0A0A] p-3 inline-block shadow-neo-sm">
                  <p className="text-sm font-bold text-[#0A0A0A]/60 mb-1">Example</p>
                  <p className="font-bold">{step.example}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* What you can automate */}
      <section className="border-t-2 border-[#0A0A0A] bg-[#0A0A0A] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-12">Things you can automate</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '📅', title: 'Regular savings', desc: '"Save $200 in crypto every month"' },
              { emoji: '📉', title: 'Buy the dip', desc: '"Buy more whenever price drops 15%"' },
              { emoji: '📈', title: 'Take profits', desc: '"Sell 30% when I\'m up 50%"' },
              { emoji: '🛡️', title: 'Protect yourself', desc: '"Sell everything if it drops 40%"' },
              { emoji: '🔄', title: 'Rebalance', desc: '"Keep my portfolio 50/50 each month"' },
              { emoji: '🎯', title: 'Reach a goal', desc: '"Save $10,000 by end of year"' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="border-2 border-white/20 p-5 hover:border-[#F5E642] transition-colors">
                <span className="text-3xl mb-3 block">{emoji}</span>
                <h3 className="font-black text-lg mb-1">{title}</h3>
                <p className="text-white/60 text-sm font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t-2 border-[#0A0A0A] py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-10">Common questions</h2>
          <div className="space-y-0">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="border-2 border-[#0A0A0A] p-6 -mt-0.5">
                <h3 className="font-black text-lg mb-2">{q}</h3>
                <p className="font-medium text-[#0A0A0A]/70 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t-2 border-[#0A0A0A] bg-[#F5E642] py-16 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-4xl font-black mb-4">Makes sense?<br />Give it a try.</h2>
          <p className="font-medium text-[#0A0A0A]/70 mb-8">Free to use. Takes 60 seconds to set up your first automation.</p>
          <Link href="/dashboard" className="neo-btn text-lg px-10 py-4 inline-flex items-center gap-2">
            Start automating <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
