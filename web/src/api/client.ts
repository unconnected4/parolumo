import type { Card, LookupResponse, User } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `API request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && data.detail) {
        errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      } else if (data && data.message) {
        errorMsg = data.message;
      }
    } catch {
      // Keep default errorMsg if JSON parsing fails
    }
    const err = new Error(errorMsg) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }
  return res.json();
}

export async function lookup(q: string): Promise<LookupResponse> {
  const trimmed = q.trim();
  if (!trimmed) {
    return { query: '', lexemes: [] };
  }
  const res = await fetch(`${BASE_URL}/dictionary/lookup?q=${encodeURIComponent(trimmed)}`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<LookupResponse>(res);
}

export async function listCards(): Promise<Card[]> {
  const res = await fetch(`${BASE_URL}/cards`, {
    headers: { Accept: 'application/json' },
  });
  return handleResponse<Card[]>(res);
}

export async function saveCard(senseId: string): Promise<Card> {
  const res = await fetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ sense_id: senseId }),
  });
  return handleResponse<Card>(res);
}

export async function deleteCard(cardId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/cards/${encodeURIComponent(cardId)}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(res);
}

export async function login(credentials: { email: string; password: string }): Promise<User> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse<User>(res);
}

export async function register(credentials: { email: string; password: string }): Promise<User> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse<User>(res);
}

export async function logout(): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
  });
  return handleResponse<void>(res);
}

export async function getMe(): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Accept: 'application/json' },
  });
  if (res.status === 401) {
    return null;
  }
  return handleResponse<User>(res);
}
