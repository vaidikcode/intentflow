import { createClient } from '@supabase/supabase-js';
import type { Intent, Execution } from '@/types/intent';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Intents ──────────────────────────────────────────────────────────────────

export async function getIntentsByAddress(address: string): Promise<Intent[]> {
  const { data, error } = await supabase
    .from('intents')
    .select('*')
    .eq('user_address', address.toLowerCase())
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createIntent(
  intent: Omit<Intent, 'id' | 'created_at' | 'updated_at' | 'execution_count'>
): Promise<Intent> {
  const { data, error } = await supabase
    .from('intents')
    .insert({
      ...intent,
      user_address: intent.user_address.toLowerCase(),
      execution_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIntentStatus(
  id: string,
  status: Intent['status'],
  onChainHash?: string
): Promise<void> {
  const { error } = await supabase
    .from('intents')
    .update({
      status,
      on_chain_hash: onChainHash,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}

export async function cancelIntent(id: string): Promise<void> {
  await updateIntentStatus(id, 'cancelled');
}

// ── Executions ───────────────────────────────────────────────────────────────

export async function getExecutionsByIntentId(intentId: string): Promise<Execution[]> {
  const { data, error } = await supabase
    .from('executions')
    .select('*')
    .eq('intent_id', intentId)
    .order('executed_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getRecentExecutions(address: string, limit = 20): Promise<Execution[]> {
  const { data, error } = await supabase
    .from('executions')
    .select('*, intents!inner(user_address)')
    .eq('intents.user_address', address.toLowerCase())
    .order('executed_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

export async function logExecution(
  execution: Omit<Execution, 'id' | 'executed_at'>
): Promise<Execution> {
  const { data, error } = await supabase
    .from('executions')
    .insert(execution)
    .select()
    .single();

  if (error) throw error;

  // Increment execution count on the intent
  await supabase.rpc('increment_execution_count', { intent_id: execution.intent_id });

  return data;
}
