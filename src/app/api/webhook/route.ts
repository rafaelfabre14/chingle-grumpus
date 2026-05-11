import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import { sendOrderConfirmation } from '@/lib/email';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    let items: { name: string; product_id: string; quantity: number; price: number }[] = [];
    try { items = JSON.parse(session.metadata?.cart_items ?? '[]'); } catch {}

    let shippingAddress = null;
    try { shippingAddress = JSON.parse(session.metadata?.shipping_address ?? 'null'); } catch {}

    const customerName = session.metadata?.customer_name ?? '';
    const customerPhone = session.metadata?.customer_phone ?? '';
    const customerEmail = session.customer_details?.email ?? '';
    const total = session.amount_total ? session.amount_total / 100 : 0;

    const supabase = createServiceClient();
    const { data: order } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        customer_email: customerEmail,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        items,
        total,
        status: 'paid',
      })
      .select('order_number')
      .single();

    if (customerEmail && customerName && order?.order_number) {
      await sendOrderConfirmation({
        to: customerEmail,
        orderNumber: order.order_number,
        customerName,
        items,
        total,
        shippingAddress: shippingAddress ?? { street: '', city: '', state: '', zip: '' },
      }).catch(err => console.error('Confirmation email failed:', err));
    }
  }

  return NextResponse.json({ received: true });
}
