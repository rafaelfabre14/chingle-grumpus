import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('giveaway_config')
    .select('*, prize:active_prize_product_id(id, name, image_url)')
    .eq('id', 1)
    .single();
  return NextResponse.json({ config: data });
}

export async function PATCH(req: NextRequest) {
  const { active_prize_product_id } = await req.json();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('giveaway_config')
    .update({ active_prize_product_id: active_prize_product_id || null })
    .eq('id', 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
