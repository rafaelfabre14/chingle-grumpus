import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Idempotent — skip if already written by webhook
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_session_id', sessionId)
    .maybeSingle();

  if (!existing) {
    const rawItems = session.metadata?.cart_items;
    let items = [];
    try { items = rawItems ? JSON.parse(rawItems) : []; } catch {}
    let shippingAddress = null;
    try { shippingAddress = session.metadata?.shipping_address ? JSON.parse(session.metadata.shipping_address) : null; } catch {}

    await supabase.from('orders').insert({
      stripe_session_id: session.id,
      customer_email: session.customer_details?.email ?? null,
      customer_name: session.metadata?.customer_name ?? null,
      customer_phone: session.metadata?.customer_phone ?? null,
      shipping_address: shippingAddress,
      items,
      total: session.amount_total ? session.amount_total / 100 : 0,
      status: session.payment_status === 'paid' ? 'paid' : 'pending',
    });
  }

  const { data: order } = await supabase
    .from('orders')
    .select('order_number')
    .eq('stripe_session_id', sessionId)
    .single();

  return NextResponse.json({ ok: true, orderNumber: order?.order_number ?? null });
}
