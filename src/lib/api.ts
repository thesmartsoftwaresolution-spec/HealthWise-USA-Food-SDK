import { isSupabaseConfigured, supabase } from './supabase.ts';

/** Bridges legacy /api/* calls to the Supabase Edge Function while preserving the existing UI contract. */
export function installSupabaseApiBridge(): void {
  if (typeof window === 'undefined') return;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const url = new URL(rawUrl, window.location.origin);
    if (!url.pathname.startsWith('/api/')) return nativeFetch(input, init);
    if (!isSupabaseConfigured || !supabase) {
      return Response.json({ success: false, error: 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.' }, { status: 503 });
    }
    let payload: unknown;
    if (typeof init?.body === 'string' && init.body) {
      try { payload = JSON.parse(init.body); } catch { payload = init.body; }
    } else if (input instanceof Request && input.method !== 'GET' && input.method !== 'HEAD') {
      try { payload = await input.clone().json(); } catch { payload = undefined; }
    }
    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const { data, error } = await supabase.functions.invoke('api', {
      body: { path: url.pathname + url.search, method, payload },
    });
    if (error) {
      const status = Number((error as { context?: { status?: number } }).context?.status) || 502;
      return Response.json({ success: false, error: error.message || 'Supabase API request failed.' }, { status });
    }
    return Response.json(data ?? { success: false, error: 'Empty API response.' });
  };
}
