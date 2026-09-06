import { NextResponse } from 'next/server';
import tests from '@/data/tests.json';

export async function GET() {
  try {
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Failed to read tests:', error);
    return NextResponse.json({ error: 'Failed to load tests' }, { status: 500 });
  }
}
