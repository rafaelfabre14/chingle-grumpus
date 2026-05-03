import { createServiceClient } from '@/lib/supabase/server';
import { EmailSignup, GiveawayEntry } from '@/types';

export const revalidate = 0;

const sourceColors: Record<string, { bg: string; text: string }> = {
  homepage:      { bg: '#dbeafe', text: '#1e40af' },
  live_drop:     { bg: '#fef9c3', text: '#854d0e' },
  order_success: { bg: '#dcfce7', text: '#166534' },
  giveaway:      { bg: '#fae8ff', text: '#7e22ce' },
};

export default async function AdminSignups() {
  const supabase = createServiceClient();
  const [{ data: rawSignups }, { data: rawEntries }] = await Promise.all([
    supabase.from('email_signups').select('*').order('created_at', { ascending: false }),
    supabase.from('giveaway_entries').select('*').order('created_at', { ascending: false }),
  ]);
  const signups = (rawSignups ?? []) as EmailSignup[];
  const entries = (rawEntries ?? []) as GiveawayEntry[];

  const sourceCounts = signups.reduce<Record<string, number>>((acc, s) => {
    acc[s.source] = (acc[s.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>EMAIL SIGNUPS</h1>
        <p className="text-sm text-gray-500 font-semibold">
          {(signups?.length ?? 0) + (entries?.length ?? 0)} total contacts
        </p>
      </div>

      {/* Source breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(Object.entries(sourceCounts) as [string, number][]).map(([src, count]) => {
          const c = sourceColors[src] ?? { bg: '#f3f4f6', text: '#374151' };
          return (
            <div
              key={src}
              className="p-4 text-center"
              style={{ background: '#fff', border: '3px solid #000', boxShadow: '3px 3px 0 #000', borderRadius: '4px' }}
            >
              <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-bebas), serif' }}>{count}</p>
              <span
                className="inline-block px-2 py-0.5 text-xs font-bold rounded mt-1"
                style={{ background: c.bg, color: c.text, border: '1px solid currentColor' }}
              >
                {src.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Email list table */}
      <div className="mb-8">
        <h2 className="mb-3" style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
          EMAIL LIST ({signups?.length ?? 0})
        </h2>
        <div style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff', overflow: 'hidden', boxShadow: '4px 4px 0 #000' }}>
          {signups.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm font-semibold">No signups yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
                  {['Email', 'Source', 'Marketing Opt-in', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signups.map((s, i) => {
                  const c = sourceColors[s.source] ?? { bg: '#f3f4f6', text: '#374151' };
                  return (
                    <tr key={s.id} style={{ borderBottom: i < signups.length - 1 ? '2px solid #eee' : 'none' }}>
                      <td className="px-4 py-3 font-semibold text-xs">{s.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs font-bold rounded" style={{ background: c.bg, color: c.text, border: '1px solid currentColor' }}>
                          {s.source.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold">{s.marketing_opt_in ? '✓ Yes' : '✗ No'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Giveaway entries */}
      <div>
        <h2 className="mb-3" style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
          GIVEAWAY ENTRIES ({entries?.length ?? 0})
        </h2>
        <div style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff', overflow: 'hidden', boxShadow: '4px 4px 0 #000' }}>
          {!entries || entries.length === 0 ? (
            <p className="p-8 text-center text-gray-400 text-sm font-semibold">No giveaway entries yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
                  {['Name', 'Email', 'Week Of', 'Marketing', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={e.id} style={{ borderBottom: i < entries.length - 1 ? '2px solid #eee' : 'none' }}>
                    <td className="px-4 py-3 font-semibold text-xs">{e.first_name}</td>
                    <td className="px-4 py-3 text-xs">{e.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{e.week_of}</td>
                    <td className="px-4 py-3 text-xs font-semibold">{e.marketing_opt_in ? '✓ Yes' : '✗ No'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(e.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
