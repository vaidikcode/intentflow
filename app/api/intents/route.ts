import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/intents?address=0x...
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'address param required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('intents')
    .select('*')
    .eq('user_address', address.toLowerCase())
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ intents: data });
}

// POST /api/intents — create a new intent
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_address, raw_text, parsed } = body;

    if (!user_address || !raw_text || !parsed) {
      return NextResponse.json({ error: 'user_address, raw_text, and parsed are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('intents')
      .insert({
        user_address: user_address.toLowerCase(),
        raw_text,
        parsed,
        status: 'pending',
        execution_count: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ intent: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
