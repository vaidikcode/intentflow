import type { Intent } from '@/types/intent';

interface StatsBarProps {
  intents: Intent[];
}

export function StatsBar({ intents }: StatsBarProps) {
  const running = intents.filter((i) => i.status === 'active').length;
  const scheduled = intents.filter((i) => i.status === 'pending').length;
  const done = intents.filter((i) => i.status === 'executed').length;
  const totalRuns = intents.reduce((s, i) => s + i.execution_count, 0);

  const stats = [
    { label: 'Running now', value: running, bg: 'bg-[#00C853]', text: 'text-white' },
    { label: 'Scheduled', value: scheduled, bg: 'bg-[#F5E642]', text: 'text-[#0A0A0A]' },
    { label: 'Completed', value: done, bg: 'bg-[#0A0A0A]', text: 'text-white' },
    { label: 'Total runs', value: totalRuns, bg: 'bg-white', text: 'text-[#0A0A0A]' },
  ];

  return (
    <div className="grid grid-cols-4 border-2 border-[#0A0A0A] shadow-neo overflow-hidden">
      {stats.map(({ label, value, bg, text }, i) => (
        <div key={label} className={`${bg} ${text} p-4 ${i < 3 ? 'border-r-2 border-[#0A0A0A]' : ''}`}>
          <p className="text-3xl font-black leading-none">{value}</p>
          <p className="text-xs font-bold uppercase tracking-wide mt-1 opacity-70">{label}</p>
        </div>
      ))}
    </div>
  );
}
