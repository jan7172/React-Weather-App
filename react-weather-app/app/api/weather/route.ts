
import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather';

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city');
  if (!city) {
    return NextResponse.json({ error: 'Kein Ort angegeben' }, { status: 400 });
  }

  try {
    const data = await fetchWeather(city);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
