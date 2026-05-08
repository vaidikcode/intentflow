import { streamText, tool } from 'ai';
import { z } from 'zod';
import { model } from '@/lib/ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const GOALS_SYSTEM_PROMPT = `You are AutoPilot's friendly AI financial planner. You help everyday people automate their crypto savings and investments.

Your job:
1. Listen to the user's financial goal in plain English
2. Build a complete, practical automation plan using the \`buildGoalPlan\` tool
3. Explain everything in simple, friendly language — NO technical jargon
4. When user confirms, save each automation using \`saveGoalPlan\`

Rules for your language:
- Say "save" not "stake"
- Say "price drops" not "bearish divergence"
- Say "automatically" not "via smart contract execution"
- Say "your money" not "your assets"
- Say "safe savings" not "stablecoin allocation"
- Say "running" not "active"
- Be encouraging and friendly

Always create 3-5 specific automations that work together as a complete plan.
Make the numbers realistic and specific (e.g. "$96/week" not "some amount weekly").`;

const AutomationSchema = z.object({
  emoji: z.string().describe('A relevant emoji for this automation'),
  title: z.string().describe('Short, plain English title (max 8 words)'),
  description: z.string().describe('One sentence explaining what this does in plain English'),
  frequency: z.string().describe('When it runs e.g. "Every Monday" or "When price drops 20%"'),
  action: z.enum(['buy', 'sell', 'transfer', 'swap', 'stake']),
  amount: z.string().optional().describe('Dollar amount e.g. "$96"'),
  trigger: z.string().describe('Plain English trigger e.g. "Every Monday morning" or "If price drops 20%"'),
});

export async function POST(req: Request) {
  const { messages, userAddress } = await req.json();

  const result = streamText({
    model,
    system: GOALS_SYSTEM_PROMPT,
    messages,
    maxSteps: 5,
    tools: {
      buildGoalPlan: tool({
        description: 'Build a complete automation plan for the user\'s goal. Call this after understanding what the user wants.',
        parameters: z.object({
          goalSummary: z.string().describe('Plain English summary of the user\'s goal'),
          timeframe: z.string().optional().describe('e.g. "by end of year" or "over 6 months"'),
          totalAmount: z.string().optional().describe('Target amount e.g. "$5,000"'),
          weeklyAmount: z.string().optional().describe('Calculated weekly saving amount'),
          automations: z.array(AutomationSchema).min(2).max(6),
          encouragement: z.string().describe('A short, friendly sentence motivating the user'),
        }),
        execute: async (plan) => ({ type: 'goal_plan', plan }),
      }),

      saveGoalPlan: tool({
        description: 'Save all automations in the goal plan to the database. Call this only when user explicitly confirms.',
        parameters: z.object({
          goalSummary: z.string(),
          automations: z.array(AutomationSchema),
        }),
        execute: async ({ goalSummary, automations }) => {
          if (!userAddress) return { type: 'error', message: 'Please connect your wallet first' };

          try {
            const rows = automations.map((a) => ({
              user_address: userAddress.toLowerCase(),
              raw_text: `[Goal: ${goalSummary}] ${a.title}: ${a.description}`,
              parsed: {
                action: a.action,
                trigger: 'time_recurring',
                triggerValue: a.trigger,
                amount: a.amount?.replace('$', ''),
                amountType: 'fixed',
                confidence: 0.95,
                summary: a.title,
              },
              status: 'active',
              execution_count: 0,
            }));

            const { error } = await supabase.from('intents').insert(rows);
            if (error) throw error;

            return { type: 'goal_saved', count: automations.length, goalSummary };
          } catch (err) {
            return { type: 'error', message: err instanceof Error ? err.message : 'Failed to save' };
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
