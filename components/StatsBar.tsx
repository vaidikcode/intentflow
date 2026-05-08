import type { Intent } from '@/types/intent';

interface StatsBarProps {
  intents: Intent[];
}

export function StatsBar({ intents }: StatsBarProps) {
  const active = intents.filter((i) => i.status === 'active').length;
  const pending = intents.filter((i) => i.status === 'pending').length;
  const executed = intents.filter((i) => i.status === 'executed').length;
  const totalRuns = intents.reduce((s, i) => s + i.execution_count, 0);

  const stats = [
    { label: 'Active', value: active },
    { label: 'Pending', value: pending },
    { label: 'Completed', value: executed },
    { label: 'Total Runs', value: totalRuns },
  ];

  return (
    <div className="grid grid-cols-4 gap-px border border-border rounded-lg overflow-hidden bg-border">
      {stats.map(({ label, value }) => (
        <div key={label} className="bg-background px-4 py-3">
          <p className="text-xl font-semibold font-mono">{value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
