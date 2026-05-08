import Anthropic from '@anthropic-ai/sdk';
import type { ParsedIntent } from '@/types/intent';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are an expert DeFi intent parser for IntentFlow — a protocol that converts plain English instructions into structured on-chain automation.

Your job is to parse a user's natural language intent and return a structured JSON object.

Rules:
- Be conservative: if you're unsure, set confidence < 0.7 and add warnings
- Token symbols: ETH, USDC, USDT, DAI, WBTC, WETH, etc.
- Amount "all" means 100%, "half" means 50%
- "recurring" implies time_recurring trigger
- Gas conditions combine with other triggers
- Always provide a clear human-readable summary

Return ONLY valid JSON matching this TypeScript type:
{
  action: 'swap' | 'buy' | 'sell' | 'transfer' | 'stake' | 'unstake' | 'bridge' | 'approve' | 'custom',
  fromToken?: string,
  toToken?: string,
  amount?: string,
  amountType?: 'fixed' | 'percentage' | 'all',
  trigger: 'price_above' | 'price_below' | 'price_change_percent' | 'time_recurring' | 'time_once' | 'gas_below' | 'manual' | 'compound',
  triggerValue?: string,
  triggerToken?: string,
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'once',
    dayOfWeek?: number,
    time?: string
  },
  gasLimit?: string,
  slippage?: number,
  confidence: number,
  summary: string,
  warnings?: string[]
}`;

export async function parseIntent(rawText: string): Promise<ParsedIntent> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Parse this DeFi intent: "${rawText}"`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.text.match(/```(?:json)?\n?([\s\S]+?)\n?```/) ||
                    content.text.match(/(\{[\s\S]+\})/);

  if (!jsonMatch) {
    throw new Error('Could not extract JSON from Claude response');
  }

  const parsed = JSON.parse(jsonMatch[1]) as ParsedIntent;
  return parsed;
}

export async function explainIntent(parsed: ParsedIntent): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Explain this DeFi automation intent in 2-3 simple sentences for a non-technical user.
        Be specific about what will happen, when, and any risks.
        Intent: ${JSON.stringify(parsed)}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  return content.text;
}

export async function suggestIntents(address: string): Promise<string[]> {
  const suggestions = [
    'Buy $50 of ETH every Monday at 9am',
    'Swap all my USDC to ETH when ETH drops below $2,500',
    'Transfer 10% of my ETH to my savings wallet on the 1st of every month',
    'Sell half my ETH position if it drops 20% in 24 hours',
    'Move staking rewards to USDC automatically when gas is under 15 gwei',
  ];
  return suggestions;
}
