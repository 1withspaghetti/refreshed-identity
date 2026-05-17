import { error } from '@sveltejs/kit';
import z from 'zod/v4';

export const idValidator = z.uuid('Invalid UUID format');

export function validateId(id: string): string {
	const parseRes = idValidator.safeParse(id);
	if (!parseRes.success) error(400, 'Invalid ID');
	return parseRes.data;
}
