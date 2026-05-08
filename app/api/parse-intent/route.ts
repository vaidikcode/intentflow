import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { model } from '@/lib/ai';

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

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length < 5) {
      return NextResponse.json({ error: 'Intent text must be at least 5 characters' }, { status: 400 });
    }

    const { object } = await generateObject({
      model,
      schema: ParsedIntentSchema,
      prompt: `Parse this DeFi automation intent into a structured object: "${text.trim()}"

Be precise about tokens, amounts, and trigger conditions.
Set confidence based on how clearly the intent was specified (0-1).
Add warnings if any part is ambiguous or risky.`,
    });

    return NextResponse.json({ parsed: object });
  } catch (error) {
    console.error('[parse-intent]', error);
    return NextResponse.json({ error: 'Failed to parse intent' }, { status: 500 });
  }
}
