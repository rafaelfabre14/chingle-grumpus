'use client';

import { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface StripeStatus {
  connected: boolean;
  accountId: string | null;
  email: string | null;
}

export default function StripeSetupClient({ status }: { status: StripeStatus }) {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stripe/callback', { method: 'POST' });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Status card */}
      <div
        className="p-6"
        style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 flex items-center justify-center rounded shrink-0"
            style={{ background: '#635bff', border: '2px solid #000' }}
          >
            <CreditCard size={22} color="#fff" />
          </div>
          <div className="flex-1">
            <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.4rem', letterSpacing: '0.05em' }}>
              STRIPE ACCOUNT
            </h2>
            {status.connected ? (
              <div className="mt-2 flex flex-col gap-1">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded w-fit"
                  style={{ background: '#dcfce7', color: '#166534', border: '1px solid #166534' }}
                >
                  <CheckCircle size={11} /> CONNECTED
                </span>
                {status.accountId && (
                  <p className="text-xs text-gray-400 font-mono mt-1">{status.accountId}</p>
                )}
              </div>
            ) : (
              <div className="mt-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-bold rounded"
                  style={{ background: '#fef9c3', color: '#854d0e', border: '1px solid #854d0e' }}
                >
                  <AlertCircle size={11} /> NOT CONNECTED
                </span>
                <p className="text-xs text-gray-500 font-semibold mt-3 leading-relaxed">
                  This store is currently using Matic AI&apos;s Stripe test account. Connect your own Stripe account to receive real payments directly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connect or manage */}
      <div
        className="p-6"
        style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
      >
        {status.connected ? (
          <>
            <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.4rem', letterSpacing: '0.05em', marginBottom: '8px' }}>
              YOUR ACCOUNT IS ACTIVE
            </h2>
            <p className="text-xs text-gray-500 font-semibold mb-4 leading-relaxed">
              All payments are deposited directly to your Stripe account. View your dashboard to manage payouts and transactions.
            </p>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
            >
              <ExternalLink size={11} />
              Open Stripe Dashboard →
            </a>
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.4rem', letterSpacing: '0.05em', marginBottom: '8px' }}>
              CONNECT YOUR STRIPE ACCOUNT
            </h2>
            <p className="text-xs text-gray-500 font-semibold mb-6 leading-relaxed">
              Click below to set up your Stripe account. You&apos;ll be guided through a quick onboarding — no API keys needed. Takes about 5 minutes.
            </p>

            <button
              onClick={handleConnect}
              disabled={loading}
              className="inline-flex items-center gap-3 px-6 py-3 font-bold btn-comic"
              style={{
                background: '#635bff',
                color: '#fff',
                borderRadius: '4px',
                fontFamily: 'var(--font-nunito), sans-serif',
                fontSize: '0.95rem',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm5.405 22.676c-1.33 2.722-3.97 4.324-7.088 4.324-4.437 0-7.317-3.04-7.317-7.0 0-4.002 2.88-7.0 7.317-7.0 2.902 0 5.378 1.398 6.797 3.74l-3.266 1.882c-.726-1.17-1.992-1.877-3.531-1.877-2.42 0-4.009 1.702-4.009 3.255 0 1.554 1.59 3.255 4.009 3.255 1.648 0 2.953-.75 3.63-1.976l3.458 1.397z" fill="white"/>
              </svg>
              {loading ? 'REDIRECTING...' : 'SET UP WITH STRIPE'}
              {!loading && <ExternalLink size={14} />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
