import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function proxyRequest(request: NextRequest, method: string = 'POST') {
  // Convertir /api/auth/* → /api/v1/auth/*
  const path = request.nextUrl.pathname.replace('/api/auth', '/api/v1/auth');
  const body = await request.text();

  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: method === 'POST' || method === 'PUT' ? body : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Auth API Error:', error);
    return NextResponse.json(
      { message: 'Error de conexión con el servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}