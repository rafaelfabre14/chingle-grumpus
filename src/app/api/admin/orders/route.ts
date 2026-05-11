import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendShippingConfirmation } from '@/lib/email';

export async function PATCH(req: NextRequest) {
  const { id, status, tracking_number } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === 'fulfilled') {
    const { data: order } = await supabase
      .from('orders')
      .select('customer_email, customer_name, items, order_number')
      .eq('id', id)
      .single();

    if (order?.customer_email && order?.customer_name && order?.order_number) {
      await sendShippingConfirmation({
        to: order.customer_email,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        items: order.items ?? [],
        trackingNumber: tracking_number,
      }).catch(err => console.error('Shipping email failed:', err));
    }
  }

  return NextResponse.json({ ok: true });
}
