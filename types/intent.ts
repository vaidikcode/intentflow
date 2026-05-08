export type IntentAction =
  | 'swap'
  | 'buy'
  | 'sell'
  | 'transfer'
  | 'stake'
  | 'unstake'
  | 'bridge'
  | 'approve'
  | 'custom';

export type IntentTrigger =
  | 'price_above'
  | 'price_below'
  | 'price_change_percent'
  | 'time_recurring'
  | 'time_once'
  | 'gas_below'
  | 'manual'
  | 'compound';

export type IntentStatus = 'pending' | 'active' | 'executed' | 'failed' | 'cancelled';

export interface ParsedIntent {
  action: IntentAction;
  fromToken?: string;
  toToken?: string;
  amount?: string;
  amountType?: 'fixed' | 'percentage' | 'all';
  trigger: IntentTrigger;
  triggerValue?: string;
  triggerToken?: string;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'once';
    dayOfWeek?: number;
    time?: string;
  };
  gasLimit?: string;
  slippage?: number;
  confidence: number; // 0-1, how confident Claude is in parsing
  summary: string;   // human-readable summary
  warnings?: string[];
}

export interface Intent {
  id: string;
  user_address: string;
  raw_text: string;
  parsed: ParsedIntent;
  status: IntentStatus;
  on_chain_hash?: string;
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  execution_count: number;
}

export interface Execution {
  id: string;
  intent_id: string;
  tx_hash?: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  gas_used?: string;
  executed_at: string;
  details?: Record<string, unknown>;
}
