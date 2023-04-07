import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
type LoginPageData = { callback: string | null };

export const load = (({ params, url }) => {
  let callback = url.searchParams.get('callback');
  return { callback };
}) satisfies PageServerLoad<LoginPageData>;

export type TLoginResponse = {
  message?: string;
  user?: string;
  session?: string;
};

export const actions = {
  default: async ({ request, cookies }): Promise<string> => {
    const { API_URL } = env;
    if (API_URL) {
      const fd = await request.formData();
      let d: Record<string, string> = {};
      fd.forEach((v, k) => (d[k] = v.toString()));
      const callback = d.callback === '' ? '/' : d.callback;
      const url = `${env.API_URL}/v1/auth/login`;
      const res = await fetch(url, {
        // credentials: 'include',
        method: 'POST',
        body: JSON.stringify(d),
        headers: { 'Content-Type': 'application/json' },
      });
      const body = (await res.json()) as TLoginResponse;
      const fCookies = res.headers.get('set-cookie');
      if (fCookies) {
        const parsed = fCookies.split(', ').map((c) => c.split('; '));
        parsed.forEach((c) => {
          const [name, value] = c[0].split('=');
          const kv: Record<string, string> = {};
          let httpOnly = false;
          c.slice(1).forEach((cc) => {
            const [n, v] = cc.split('=');
            if (n === 'HttpOnly') httpOnly = true;
            kv[n] = v;
          });
          const cConfig: {
            domain?: string;
            maxAge: any;
            path: string;
            sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
            httpOnly: boolean;
          } = {
            domain: kv['Domain'],
            maxAge: JSON.parse(kv['Max-Age']),
            path: kv['Path'],
            sameSite: 'lax',
            httpOnly: httpOnly,
          };
          cookies.set(name, value, { ...cConfig });
        });
      }
      if (body.message) return body.message;
      throw redirect(303, callback);
    } else {
      return 'API_URL not set';
    }
  },
};
