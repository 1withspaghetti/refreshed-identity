import type { RequestHandler } from './$types';
import { deleteSessionTokenCookie, invalidateSession } from '@/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { session } = await locals.auth();

	await invalidateSession(session.id);
	deleteSessionTokenCookie();
	return redirect(302, '/');
};
