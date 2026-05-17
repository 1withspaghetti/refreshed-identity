import { profileEditSchema } from '@/validators/profileEditValidator';
import type { Actions, PageServerLoad } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getDb, table } from '@/server/db';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals, platform }) => {
	const { user } = await locals.auth();
	const db = getDb(platform?.env.DB);
	const fullUser = await db.query.users.findFirst({
		columns: {
			id: true,
			email: true,
			name: true,
			pfp: true,
			firstLogin: true,
			lastLogin: true
		},
		where: eq(table.users.id, user.id)
	});

	if (!fullUser) error(404, 'User not found');

	return {
		user: fullUser,
		form: await superValidate(
			{
				name: fullUser.name
			},
			zod4(profileEditSchema)
		)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, platform }) => {
		const { user } = await locals.auth();
		const form = await superValidate(request, zod4(profileEditSchema));

		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });

		const db = getDb(platform?.env.DB);

		await db
			.update(table.users)
			.set({
				name: form.data.name
			})
			.where(eq(table.users.id, user.id));

		return message(form, { type: 'success', text: 'Profile updated successfully!' });
	}
};
