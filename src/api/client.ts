export const API_BASE = "http://localhost:8080"; 

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");
  const validToken = token && token !== "undefined" && token !== "null" ? token : null;

  console.log("token from localStorage:", token);
  console.log("validToken:", validToken);

  return {
    "Content-Type": "application/json",
    ...(validToken ? { Authorization: `Bearer ${validToken}` } : {}),
  };
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(json?.message ?? `HTTP ${res.status} ${res.statusText}`);
  }

  return (json?.data ?? null) as T;
}