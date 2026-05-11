import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) return NextResponse.json({ cards: [] });

  const res = await fetch(
    `https://api.pokemontcg.io/v2/cards?q=name:"${encodeURIComponent(q)}"&pageSize=20&select=id,name,set,images`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return NextResponse.json({ cards: [] });
  const data = await res.json();
  return NextResponse.json({ cards: data.data ?? [] });
}
