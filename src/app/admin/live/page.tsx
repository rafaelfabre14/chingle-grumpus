import { createServiceClient } from '@/lib/supabase/server';
import LiveDropControl from './LiveDropControl';

export const revalidate = 0;

export default async function AdminLive() {
  const supabase = createServiceClient();
  const { data: liveDrop } = await supabase
    .from('live_drops')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>LIVE DROP</h1>
        <p className="text-sm text-gray-500 font-semibold">Control your live drop status and schedule.</p>
      </div>
      <LiveDropControl liveDrop={liveDrop} />
    </div>
  );
}
