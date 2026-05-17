import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getDb, table } from '@/server/db';
import { and, eq, not } from 'drizzle-orm';
import { identityCreateSchema } from '@/validators/identityEditValidator';
import { error } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { PUBLIC_GLOBAL_SALT } from '$env/static/public';

export const load = (async ({ locals, platform }) => {
	const { user } = await locals.auth();
	const db = getDb(platform?.env.DB);
	const replacements = await db.query.replacements.findFirst({
		columns: {
			id: true,
			deadname: true,
			email: true,
			replacement: true
		},
		where: eq(table.replacements.userId, user.id)
	});

	return {
		form: await superValidate(
			{
				deadname: replacements?.deadname || '',
				email: replacements?.email || '',
				replacement: replacements?.replacement || user.name || ''
			},
			zod4(identityCreateSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(identityCreateSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		const db = getDb(platform?.env.DB);

		const data = {
			deadname: form.data.deadname.toLowerCase(),
			email: form.data.email?.toLowerCase(),
			replacement: form.data.replacement
		};

		const existing = await db.query.replacements.findFirst({
			columns: {
				id: true,
				deadname: true,
				email: true
			},
			where: and(
				eq(table.replacements.deadname, data.deadname),
				data.email ? eq(table.replacements.email, data.email) : undefined,
				not(eq(table.replacements.userId, user.id))
			)
		});
		if (existing)
			error(400, 'That name already exists in our records and may cause conflicts when replacing');

		const hash = sha256(new TextEncoder().encode(data.deadname + '_' + PUBLIC_GLOBAL_SALT));

		const userExisting = await db.query.replacements.findFirst({
			columns: {
				id: true
			},
			where: eq(table.replacements.userId, user.id)
		});

		if (userExisting)
			await db
				.update(table.replacements)
				.set({
					...data,
					hash
				})
				.where(eq(table.replacements.id, userExisting.id));
		else
			await db.insert(table.replacements).values({
				id: crypto.randomUUID(),
				userId: user.id,
				...data,
				hash
			});

		return message(form, { type: 'success', text: 'Identity updated successfully!' });
	}
};
