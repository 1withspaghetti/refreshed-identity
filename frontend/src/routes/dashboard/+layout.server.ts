import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { user } = await locals.auth();

	return {
		user: user
	};
}) satisfies LayoutServerLoad;
