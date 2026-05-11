import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('products')
    .select('id, name, image_url, category, price, is_live_drop')
    .order('name');
  return NextResponse.json({ products: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const { id, is_live_drop } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const supabase = createServiceClient();
  const { error } = await supabase.from('products').update({ is_live_drop }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
