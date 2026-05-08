import { streamText, tool } from 'ai';
import { z } from 'zod';
import { model, INTENT_SYSTEM_PROMPT } from '@/lib/ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Zod schema for a parsed intent — matches our TypeScript types
const ParsedIntentSchema = z.object({
  action: z.enum(['swap', 'buy', 'sell', 'transfer', 'stake', 'unstake', 'bridge', 'custom']),
  fromToken: z.string().optional(),
  toToken: z.string().optional(),
  amount: z.string().optional(),
  amountType: z.enum(['fixed', 'percentage', 'all']).optional(),
  trigger: z.enum([
    'price_above', 'price_below', 'price_change_percent',
    'time_recurring', 'time_once', 'gas_below', 'manual', 'compound',
  ]),
  triggerValue: z.string().optional(),
  triggerToken: z.string().optional(),
  schedule: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'once']),
    dayOfWeek: z.number().min(0).max(6).optional(),
    time: z.string().optional(),
  }).optional(),
  gasLimit: z.string().optional(),
  slippage: z.number().min(0).max(50).optional(),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  warnings: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const { messages, userAddress } = await req.json();

  const result = streamText({
    model,
    system: INTENT_SYSTEM_PROMPT,
    messages,
    maxSteps: 5, // allow multi-step tool use
    tools: {
      /**
       * parseIntent — called by the AI to structure the user's intent.
       * This is a "display" tool: result shown in chat as a confirmation card.
       */
      parseIntent: tool({
        description:
          'Parse the user DeFi intent into a structured object. Call this as soon as you understand what the user wants to automate.',
        parameters: ParsedIntentSchema,
        execute: async (parsed) => {
          // Just return the parsed data — the UI renders it as a confirmation card
          return { type: 'parsed_intent', data: parsed };
        },
      }),

      /**
       * saveIntent — called when user confirms they want to activate the intent.
       */
      saveIntent: tool({
        description:
          'Save the confirmed intent to the database and activate it. Only call this after the user explicitly confirms.',
        parameters: z.object({
          rawText: z.string().describe('The original plain-English text from the user'),
          parsed: ParsedIntentSchema,
        }),
        execute: async ({ rawText, parsed }) => {
          if (!userAddress) {
            return { type: 'save_error', error: 'No wallet connected' };
          }

          try {
            const { data, error } = await supabase
              .from('intents')
              .insert({
                user_address: userAddress.toLowerCase(),
                raw_text: rawText,
                parsed,
                status: 'active',
                execution_count: 0,
              })
              .select()
              .single();

            if (error) throw error;

            return {
              type: 'intent_saved',
              intentId: data.id,
              summary: parsed.summary,
            };
          } catch (err) {
            return {
              type: 'save_error',
              error: err instanceof Error ? err.message : 'Failed to save',
            };
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
