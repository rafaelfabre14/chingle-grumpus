import GiveawayClient from './GiveawayClient';
import { createServiceClient } from '@/lib/supabase/server';

export const revalidate = 0;

export default async function GiveawayAdminPage() {
  const supabase = createServiceClient();

  const [entriesRes, winnersRes, productsRes] = await Promise.all([
    supabase.from('giveaway_entries').select('*').order('created_at', { ascending: false }),
    supabase
      .from('giveaway_winners')
      .select('*, entry:entry_id(first_name, email), prize:prize_product_id(name, image_url)')
      .order('week_of', { ascending: false }),
    supabase.from('products').select('id, name, image_url').order('name'),
  ]);

  return (
    <GiveawayClient
      initialEntries={entriesRes.data ?? []}
      initialWinners={winnersRes.data ?? []}
      products={productsRes.data ?? []}
    />
  );
}
