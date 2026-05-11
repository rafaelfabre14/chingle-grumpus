import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) return NextResponse.json({ sets: [] });

  const res = await fetch(
    `https://api.pokemontcg.io/v2/sets?q=name:"${encodeURIComponent(q)}"&select=id,name,series,images`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return NextResponse.json({ sets: [] });
  const data = await res.json();
  return NextResponse.json({ sets: data.data ?? [] });
}
