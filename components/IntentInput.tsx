'use client';

import { useState } from 'react';
import { Sparkles, Send, Lightbulb, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { ParsedIntent } from '@/types/intent';

interface IntentInputProps {
  onIntentCreated: () => void;
  userAddress: string;
}

const SUGGESTIONS = [
  'Buy $50 of ETH every Monday at 9am',
  'Sell half my ETH if price drops 20% in 24h',
  'Swap all USDC to ETH when ETH is below $2,500',
  'Move staking rewards to cold wallet when gas < 15 gwei',
  'Transfer 10% of ETH to savings on the 1st of each month',
];

type ParseState = 'idle' | 'parsing' | 'parsed' | 'saving' | 'done' | 'error';

export function IntentInput({ onIntentCreated, userAddress }: IntentInputProps) {
  const [text, setText] = useState('');
  const [state, setState] = useState<ParseState>('idle');
  const [parsed, setParsed] = useState<ParsedIntent | null>(null);
  const [error, setError] = useState('');

  const handleParse = async () => {
    if (!text.trim() || text.trim().length < 5) return;
    setState('parsing');
    setError('');
    setParsed(null);

    try {
      const res = await fetch('/api/parse-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setParsed(data.parsed);
      setState('parsed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to parse intent');
      setState('error');
    }
  };

  const handleConfirm = async () => {
    if (!parsed || !userAddress) return;
    setState('saving');

    try {
      const res = await fetch('/api/intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_address: userAddress, raw_text: text, parsed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setState('done');
      setText('');
      setParsed(null);
      setTimeout(() => {
        setState('idle');
        onIntentCreated();
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save intent');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setParsed(null);
    setError('');
  };

  return (
    <div className="glass-card glow-sm space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-brand-400" />
        <h2 className="font-semibold text-lg">New Intent</h2>
      </div>

      {/* Text input */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); if (state !== 'idle') handleReset(); }}
          placeholder="Describe what you want to automate in plain English..."
          disabled={state === 'parsing' || state === 'saving' || state === 'done'}
          className="w-full bg-dark-700/50 border border-dark-500/50 rounded-xl px-4 py-3 text-white
                     placeholder-gray-600 resize-none focus:outline-none focus:border-brand-500/50
                     transition-colors min-h-[80px] font-mono text-sm disabled:opacity-50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleParse();
          }}
        />
        <span className="absolute bottom-3 right-3 text-xs text-gray-600">
          {text.length}/500 · ⌘↵ to parse
        </span>
      </div>

      {/* Suggestions */}
      {state === 'idle' && !text && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setText(s)}
                className="text-xs bg-dark-700 hover:bg-dark-600 border border-dark-500/50
                           hover:border-brand-500/30 text-gray-400 hover:text-white px-3 py-1.5
                           rounded-lg transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Parsed preview */}
      {parsed && (state === 'parsed' || state === 'saving') && (
        <div className="bg-dark-700/50 border border-brand-500/20 rounded-xl p-4 space-y-3 animate-fade-in">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-white font-medium">{parsed.summary}</p>
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(parsed.confidence * 100)}% · Action: {parsed.action} · Trigger: {parsed.trigger}
              </p>
            </div>
          </div>

          {parsed.warnings && parsed.warnings.length > 0 && (
            <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <ul className="text-xs text-amber-300 space-y-0.5">
                {parsed.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={state === 'saving'}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm py-2"
            >
              {state === 'saving' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Send className="w-4 h-4" /> Activate Intent</>
              )}
            </button>
            <button onClick={handleReset} className="btn-secondary text-sm py-2 px-4">
              Edit
            </button>
          </div>
        </div>
      )}

      {/* Done state */}
      {state === 'done' && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          Intent activated! Your automation is live.
        </div>
      )}

      {/* Error state */}
      {state === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={handleReset} className="ml-auto text-xs underline">Try again</button>
        </div>
      )}

      {/* Parse button */}
      {state === 'idle' || state === 'error' ? (
        <button
          onClick={handleParse}
          disabled={text.trim().length < 5}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Parse with AI
        </button>
      ) : state === 'parsing' ? (
        <button disabled className="btn-primary w-full flex items-center justify-center gap-2 opacity-70">
          <Loader2 className="w-4 h-4 animate-spin" />
          Claude is parsing...
        </button>
      ) : null}
    </div>
  );
}
