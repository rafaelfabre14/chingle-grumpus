import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const rawItems = session.metadata?.cart_items;
    let items = [];
    try {
      items = rawItems ? JSON.parse(rawItems) : [];
    } catch {}

    const supabase = createServiceClient();
    await supabase.from('orders').insert({
      stripe_session_id: session.id,
      customer_email: session.customer_details?.email ?? null,
      items,
      total: session.amount_total ? session.amount_total / 100 : 0,
      status: 'paid',
    });
  }

  return NextResponse.json({ received: true });
}
