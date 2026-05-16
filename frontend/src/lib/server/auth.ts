import { eq, lt } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { getDb, table } from '$lib/server/db';
import { type Session } from './db/schema/session';
import { getRequestEvent } from '$app/server';
import type { SessionUser } from '@/types/user';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(20));
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const db = getDb();
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.sessions).values(session);

	// Delete old sessions for all users while we are here
	db.delete(table.sessions).where(lt(table.sessions.expiresAt, new Date()));
	// (We don't care about the result of this operation, just that it runs)

	return session;
}

export async function validateSessionToken(token: unknown) {
	if (!token || typeof token !== 'string' || token.length !== 32) {
		return { session: null, user: null };
	}

	const db = getDb();

	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const result = await db.query.sessions.findFirst({
		where: eq(table.sessions.id, sessionId),
		with: {
			user: {
				columns: {
					id: true,
					email: true,
					name: true,
					pfp: true
				}
			}
		}
	});

	if (!result) {
		return { session: null, user: null };
	}

	const session: Session = {
		id: result.id,
		userId: result.userId,
		expiresAt: result.expiresAt
	};

	const user: SessionUser = {
		...result.user
	};

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await invalidateSession(session.id);
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.sessions)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.sessions.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	const db = getDb();
	await db.delete(table.sessions).where(eq(table.sessions.id, sessionId));
}

export function setSessionTokenCookie(token: string, expiresAt: Date) {
	const event = getRequestEvent();
	event.cookies.set(sessionCookieName, token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie() {
	const event = getRequestEvent();
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
