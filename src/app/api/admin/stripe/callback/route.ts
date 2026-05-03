import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { origin } = req.nextUrl;
  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from('stripe_connections')
    .select('account_id')
    .eq('id', 'default')
    .maybeSingle();

  let accountId = existing?.account_id;

  if (!accountId) {
    const account = await stripe.accounts.create({ type: 'express' });
    accountId = account.id;
    await supabase.from('stripe_connections').upsert({
      id: 'default',
      account_id: accountId,
      connected_at: new Date().toISOString(),
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/api/admin/stripe/callback`,
    return_url: `${origin}/admin/stripe?connected=1`,
    type: 'account_onboarding',
  });

  return NextResponse.json({ url: accountLink.url });
}
