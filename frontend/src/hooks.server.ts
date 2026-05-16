import {
	deleteSessionTokenCookie,
	sessionCookieName,
	setSessionTokenCookie,
	validateSessionToken
} from '@/server/auth';
import type { Session } from '@/server/db/schema/session';
import type { SessionUser } from '@/types/user';
import { error, redirect, type Handle } from '@sveltejs/kit';

process.env.TZ = 'America/Los_Angeles';

export const handle: Handle = async ({ event, resolve }) => {
	// Save these values in case auth() is called multiple times
	let { session, user }: PartialAuthReturn = { session: null, user: null };

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	event.locals.auth = async <Req extends boolean = true>(req = true) => {
		if (session && user) return { session, user };

		const token = event.cookies.get(sessionCookieName);
		({ session, user } = await validateSessionToken(token));

		if (req && !session) {
			if (event.request.headers.get('accept')?.includes('text/html')) {
				throw redirect(302, '/?ref=' + encodeURIComponent(event.url.pathname + event.url.search));
			} else {
				throw error(401, 'Unauthorized');
			}
		}

		if (session) {
			setSessionTokenCookie(token!, session.expiresAt);
		} else {
			deleteSessionTokenCookie();
		}

		return { session, user } as AuthReturn;
	};

	return resolve(event);
};

export type AuthReturn = { session: Session; user: SessionUser };
export type PartialAuthReturn = { session: Session | null; user: SessionUser | null };

export type AuthHandler = <Req extends boolean = true>(
	required?: Req
) => Promise<Req extends true ? AuthReturn : PartialAuthReturn>;
