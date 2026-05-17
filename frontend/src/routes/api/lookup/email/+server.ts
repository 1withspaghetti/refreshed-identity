import { identityLookupEmailRequestValidator } from '@/validators/identityLookupRequestValidator';
import type { RequestHandler } from '../$types';
import { getDb, table } from '@/server/db';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, platform }) => {
	// NOTE: No auth required
	const body = identityLookupEmailRequestValidator.safeParse(await request.json());
	if (!body.success) error(400, body.error.issues[0].message);
	const email = body.data.email;

	const db = getDb(platform?.env.DB);
	const res = await db.query.replacements.findFirst({
		columns: {
			replacement: true
		},
		where: eq(table.replacements.email, email)
	});

	if (!res) error(404, 'Not found');

	return json({
		replacement: res.replacement
	});
};
