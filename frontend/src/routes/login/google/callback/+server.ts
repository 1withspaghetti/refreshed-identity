import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { decodeIdToken, type OAuth2Tokens } from 'arctic';
import { google } from '@/server/oauth';
import { getDb, table } from '@/server/db';
import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { createSession, generateSessionToken, setSessionTokenCookie } from '@/server/auth';

export interface GoogleClaims {
	sub: string;
	name: string;
	email: string;
	picture?: string;
}

export const GET: RequestHandler = async ({ url, cookies, platform }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('google_oauth_state') ?? null;
	const codeVerifier = cookies.get('google_code_verifier') ?? null;

	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return error(400, 'Missing code, state, or code verifier, please try again');
	}
	if (state !== storedState) {
		return error(400, 'Invalid state, please try again');
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch {
		// Invalid code or client credentials
		return error(400, 'Invalid code or client credentials, please try again');
	}
	const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;

	const googleId = claims.sub;
	const name = claims.name;
	const email = claims.email;
	const pfp = claims.picture;

	let userId: string;
	let redirectUrl: string;

	const db = getDb(platform!.env.DB);

	// Check if the user already exists in the database
	const existingUser = await db.query.users.findFirst({
		columns: {
			id: true,
			googleId: true,
			email: true
		},
		where: or(
			eq(table.users.googleId, googleId),
			and(eq(table.users.email, email), isNull(table.users.googleId))
		),
		orderBy: sql`${table.users.googleId} NULLS LAST`
	});

	if (existingUser) {
		if (existingUser.googleId) {
			// User already exists, update their info
			await db
				.update(table.users)
				.set({
					email,
					name,
					pfp,
					lastLogin: new Date()
				})
				.where(eq(table.users.googleId, googleId));

			userId = existingUser.id;
			redirectUrl = '/dashboard';
		} else {
			// Email exists but has not been linked to a Google account
			await db
				.update(table.users)
				.set({
					googleId,
					email,
					name,
					pfp,
					lastLogin: new Date()
				})
				.where(eq(table.users.id, existingUser.id));

			userId = existingUser.id;
			redirectUrl = '/dashboard';
		}
	} else {
		// Create a new user
		const user = await db
			.insert(table.users)
			.values({
				id: crypto.randomUUID(),
				googleId,
				name,
				email,
				pfp
			})
			.returning({ id: table.users.id });

		userId = user[0].id;
		redirectUrl = '/dashboard';
	}

	if (cookies.get('login_ref')) redirectUrl = cookies.get('login_ref')!;

	// Clean up OAuth cookies
	cookies.delete('google_oauth_state', { path: '/' });
	cookies.delete('google_code_verifier', { path: '/' });
	cookies.delete('login_ref', { path: '/' });

	// Create a session for the user
	const token = generateSessionToken();
	const session = await createSession(token, userId);
	setSessionTokenCookie(token, session.expiresAt);
	return redirect(302, redirectUrl);
};
