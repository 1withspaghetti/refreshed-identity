import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getDb, table } from '@/server/db';
import { and, eq } from 'drizzle-orm';
import { identityCreateSchema, identityDeleteSchema, identityEditSchema } from '@/validators/identityEditValidator';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals, platform }) => {
	const { user } = await locals.auth();
	const db = getDb(platform?.env.DB);
	const replacements = await db.query.replacements.findMany({
		columns: {
			id: true,
			deadname: true,
			email: true,
			replacement: true
		},
		where: eq(table.replacements.userId, user.id)
	});

	return {
		replacements: replacements,
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	new: async ({ request, locals, platform }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(identityCreateSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		const db = getDb(platform?.env.DB);

		const data = {
			deadname: form.data.deadname.toLowerCase(),
			email: form.data.email?.toLowerCase(),
			replacement: form.data.replacement
		}

		const existing = await db.query.replacements.findFirst({
			columns: {
				id: true,
				deadname: true,
				email: true
			},
			where: and(eq(table.replacements.deadname, data.deadname), data.email ? eq(table.replacements.email, data.email) : undefined)
		});

		if (existing) error(400, "That name already exists in our records and may cause conflicts when replacing");

		await db
			.insert(table.replacements)
			.values({
				id: crypto.randomUUID(),
				userId: user.id,
				...data
			});

		return message(form, { type: 'success', text: 'Identity updated successfully!' });
	},

	update: async ({ request, locals, platform }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(identityEditSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		const db = getDb(platform?.env.DB);

		const data = {
			id: form.data.id,
			deadname: form.data.deadname.toLowerCase(),
			email: form.data.email?.toLowerCase(),
			replacement: form.data.replacement
		}

		const existing = await db.query.replacements.findFirst({
			columns: {
				id: true,
				deadname: true,
				email: true
			},
			where: and(eq(table.replacements.deadname, data.deadname), data.email ? eq(table.replacements.email, data.email) : undefined)
		});

		if (existing) error(400, "That name already exists in our records and may cause conflicts when replacing");

		const res = await db
			.update(table.replacements)
			.set({
				...data
			})
			.where(and(eq(table.replacements.id, data.id), eq(table.replacements.userId, user.id)));
		
		if (!res.meta.changed_db) error(404, "Could not find identity");

		return message(form, { type: 'success', text: 'Identity updated successfully!' });
	},

	delete: async ({ request, locals, platform }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(identityDeleteSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		const db = getDb(platform?.env.DB);

		const data = {
			id: form.data.id
		}

		const res = await db
			.delete(table.replacements)
			.where(and(eq(table.replacements.id, data.id), eq(table.replacements.userId, user.id)));
		
		if (!res.meta.changed_db) error(404, "Could not find identity");

		return message(form, { type: 'success', text: 'Identity updated successfully!' });
	}
};
