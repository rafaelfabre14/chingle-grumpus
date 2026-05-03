import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = { title: 'Admin — Chingle Grumpus' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#f1ede3', fontFamily: 'var(--font-nunito), sans-serif' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
