import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import { CartItem } from '@/types';

const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_THRESHOLD = 75;

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export async function POST(req: NextRequest) {
  const { items, customer, marketingOptIn }: { items: CartItem[]; customer: CustomerInfo; marketingOptIn?: boolean } = await req.json();

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
    customer_email: customer?.email,
    shipping_options: freeShipping
      ? [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: 0, currency: 'usd' }, display_name: 'Free Shipping' } }]
      : [{ shipping_rate_data: { type: 'fixed_amount', fixed_amount: { amount: Math.round(SHIPPING_FLAT * 100), currency: 'usd' }, display_name: 'Standard Shipping' } }],
    metadata: {
      cart_items: JSON.stringify(items.map((i) => ({ name: i.name, product_id: i.product_id, quantity: i.quantity, price: i.price }))),
      customer_name: customer ? `${customer.firstName} ${customer.lastName}` : '',
      customer_phone: customer?.phone ?? '',
      shipping_address: customer ? JSON.stringify({
        street: customer.street,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
      }) : '',
    },
    success_url: `${req.nextUrl.origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/cart`,
  });

  if (marketingOptIn && customer?.email) {
    const supabase = createServiceClient();
    await supabase.from('email_signups').upsert(
      { email: customer.email.toLowerCase().trim(), source: 'order_success', marketing_opt_in: true },
      { onConflict: 'email' }
    );
  }

  return NextResponse.json({ url: session.url });
}
