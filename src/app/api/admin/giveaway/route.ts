import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const week = req.nextUrl.searchParams.get('week');
  const supabase = createServiceClient();

  const [entriesRes, winnersRes, productsRes] = await Promise.all([
    week
      ? supabase.from('giveaway_entries').select('*').eq('week_of', week).order('created_at', { ascending: false })
      : supabase.from('giveaway_entries').select('*').order('created_at', { ascending: false }),
    supabase
      .from('giveaway_winners')
      .select('*, entry:entry_id(first_name, email), prize:prize_product_id(name, image_url)')
      .order('week_of', { ascending: false }),
    supabase.from('products').select('id, name, image_url').order('name'),
  ]);

  return NextResponse.json({
    entries: entriesRes.data ?? [],
    winners: winnersRes.data ?? [],
    products: productsRes.data ?? [],
  });
}

export async function POST(req: NextRequest) {
  const { week_of, prize_product_id } = await req.json();
  if (!week_of) return NextResponse.json({ error: 'week_of required' }, { status: 400 });

  const supabase = createServiceClient();

  // Get all entries for the week
  const { data: entries } = await supabase
    .from('giveaway_entries')
    .select('id')
    .eq('week_of', week_of);

  if (!entries || entries.length === 0) {
    return NextResponse.json({ error: 'No entries for this week' }, { status: 400 });
  }

  // Random pick
  const winner = entries[Math.floor(Math.random() * entries.length)];

  const { data, error } = await supabase
    .from('giveaway_winners')
    .upsert({ week_of, entry_id: winner.id, prize_product_id: prize_product_id || null, status: 'drawn' }, { onConflict: 'week_of' })
    .select('*, entry:entry_id(first_name, email), prize:prize_product_id(name, image_url)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ winner: data });
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from('giveaway_winners').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
