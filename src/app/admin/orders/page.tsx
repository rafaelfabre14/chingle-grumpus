import { createServiceClient } from '@/lib/supabase/server';
import { Order } from '@/types';
import OrdersTable from './OrdersTable';

export const revalidate = 0;

export default async function AdminOrders() {
  const supabase = createServiceClient();
  const { data: rawOrders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  const orders = (rawOrders ?? []) as Order[];

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>ORDERS</h1>
        <p className="text-sm text-gray-500 font-semibold">{orders.length} total orders</p>
      </div>
      <OrdersTable initialOrders={orders} />
    </div>
  );
}
