import { generateCodeVerifier, generateState, Google } from 'arctic';
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, url, platform }) => {

	const callbackUrl = new URL('/login/google/callback', "https://refreshed-identity.tyler.place/").toString();

	const google = new Google(platform!.env.GOOGLE_CLIENT_ID, platform!.env.GOOGLE_CLIENT_SECRET, callbackUrl.toString());

	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const authUrl = google.createAuthorizationURL(state, codeVerifier, [
		'openid',
		'profile',
		'email'
	]);

	cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});
	cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: 'lax'
	});

	if (url.searchParams.has('ref')) {
		cookies.set('login_ref', url.searchParams.get('ref')!, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 10, // 10 minutes
			sameSite: 'lax'
		});
	}

	return redirect(302, authUrl.toString());
};
