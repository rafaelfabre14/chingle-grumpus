import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/types';

const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_THRESHOLD = 75;

export async function POST(req: NextRequest) {
  const { items }: { items: CartItem[] } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      unit_amount: Math.round(item.price * 100),
      product_data: {
        name: item.name,
        images: item.image_url ? [item.image_url] : [],
      },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    shipping_options: freeShipping
      ? [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 0, currency: 'usd' }, display_name: 'Free Shipping' } }]
      : [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: Math.round(SHIPPING_FLAT * 100), currency: 'usd' }, display_name: 'Standard Shipping' } }],
    metadata: {
      cart_items: JSON.stringify(items.map((i) => ({ product_id: i.product_id, quantity: i.quantity, price: i.price }))),
    },
    success_url: `${req.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
