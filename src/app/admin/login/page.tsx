'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Incorrect password.');
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--color-dark)' }}
    >
      <div
        className="w-full max-w-sm p-8"
        style={{ background: 'var(--color-light)', border: '4px solid #000', boxShadow: '6px 6px 0 #000', borderRadius: '4px' }}
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden" style={{ border: '3px solid #000', boxShadow: '3px 3px 0 #000' }}>
            <Image src="/mascot.jpeg" alt="Chingle Grumpus" width={64} height={64} className="object-cover w-full h-full" />
          </div>
          <div className="text-center">
            <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2rem', letterSpacing: '0.05em' }}>
              ADMIN
            </h1>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Chingle Grumpus</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-sm font-semibold"
            style={{ border: '3px solid #000', borderRadius: '4px', boxShadow: '3px 3px 0 #000', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
          />
          {error && <p className="text-xs text-red-600 font-bold">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xl font-bold btn-comic"
            style={{ background: 'var(--color-dark)', color: '#fff', fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.08em', borderRadius: '4px' }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
}
