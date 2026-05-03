import { createServiceClient } from '@/lib/supabase/server';
import StripeSetupClient from './StripeSetupClient';

export const revalidate = 0;

export default async function AdminStripe() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('stripe_connections')
    .select('account_id, connected_at')
    .eq('id', 'default')
    .maybeSingle();

  const status = {
    connected: !!data?.account_id,
    accountId: data?.account_id ?? null,
    email: null,
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>STRIPE SETUP</h1>
        <p className="text-sm text-gray-500 font-semibold">Connect your Stripe account to receive payments.</p>
      </div>
      <StripeSetupClient status={status} />
    </div>
  );
}
