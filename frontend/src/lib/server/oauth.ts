import { Google } from 'arctic';
import { env } from 'cloudflare:workers';

const callbackUrl = new URL('/login/google/callback', "https://refreshed-identity.tyler.place/").toString();

export const google = new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, callbackUrl.toString());
