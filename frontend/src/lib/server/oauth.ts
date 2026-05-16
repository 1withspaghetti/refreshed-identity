import { Google } from 'arctic';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { ORIGIN } from '$env/static/private';

const callbackUrl = new URL('/login/google/callback', ORIGIN).toString();

export const google = new Google(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, callbackUrl.toString());
