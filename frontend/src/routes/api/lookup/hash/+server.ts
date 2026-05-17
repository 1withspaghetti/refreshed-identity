import { identityLookupHashRequestValidator } from '@/validators/identityLookupRequestValidator';
import type { RequestHandler } from '../$types';
import { getDb, table } from '@/server/db';
import { error, json } from '@sveltejs/kit';
import { decodeBase64 } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, platform }) => {
	// NOTE: No auth required
	const body = identityLookupHashRequestValidator.safeParse(await request.json());
	if (!body.success) error(400, body.error.issues[0].message);
	const hash = decodeBase64(body.data.hash);

	const db = getDb(platform?.env.DB);
	const res = await db.query.replacements.findFirst({
		columns: {
			replacement: true
		},
		where: eq(table.replacements.hash, hash)
	});

	if (!res) error(404, 'Not found');

	return json({
		replacement: res.replacement
	});
};
