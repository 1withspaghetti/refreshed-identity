import { identityLookupEmailManyRequestValidator } from '@/validators/identityLookupRequestValidator';
import type { RequestHandler } from './$types';
import { getDb, table } from '@/server/db';
import { error, json } from '@sveltejs/kit';
import { inArray } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, platform }) => {
	// NOTE: No auth required
	const body = identityLookupEmailManyRequestValidator.safeParse(await request.json());
	if (!body.success) error(400, body.error.issues[0].message);

	const emails = body.data.map((s) => s.toLowerCase());

	const db = getDb(platform?.env.DB);
	const res = await db.query.replacements.findMany({
		columns: {
			email: true,
			replacement: true
		},
		where: inArray(table.replacements.email, emails)
	});

	const results = emails.map((email) => res.find((row) => row.email == email)?.replacement);

	return json(results);
};
