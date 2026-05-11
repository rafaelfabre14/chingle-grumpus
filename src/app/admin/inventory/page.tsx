import InventoryClient from './InventoryClient';
import { createServiceClient } from '@/lib/supabase/server';
import { Product } from '@/types';

export const revalidate = 0;

export default async function InventoryPage() {
  const supabase = createServiceClient();
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  return <InventoryClient initialProducts={(data ?? []) as Product[]} />;
}
