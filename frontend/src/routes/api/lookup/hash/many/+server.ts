import { identityLookupHashManyRequestValidator } from '@/validators/identityLookupRequestValidator';
import type { RequestHandler } from './$types';
import { getDb, table } from '@/server/db';
import { error, json } from '@sveltejs/kit';
import { decodeBase64 } from '@oslojs/encoding';
import { inArray } from 'drizzle-orm';

function compareUint8Arrays(a: Uint8Array, b: Uint8Array) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

export const POST: RequestHandler = async ({ request, platform }) => {
	// NOTE: No auth required
	const body = identityLookupHashManyRequestValidator.safeParse(await request.json());
	if (!body.success) error(400, body.error.issues[0].message);

	const hashes = body.data.map(decodeBase64);

	const db = getDb(platform?.env.DB);
	const res = await db.query.replacements.findMany({
		columns: {
			hash: true,
			replacement: true
		},
		where: inArray(table.replacements.hash, hashes)
	});

	const results = hashes.map(
		(hash) => res.find((row) => compareUint8Arrays(row.hash as Uint8Array, hash))?.replacement
	);

	return json(results);
};
