import { NextResponse } from 'next/server';

export function notFound() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export function internalServerError() {
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export function badRequest() {
  return NextResponse.json({ error: 'Bad request' }, { status: 400 });
}
