import z from 'zod/v4';

export const profileEditSchema = z.object({
	name: z.string().min(1, 'Display Name is required').max(500, 'Name cannot exceed 500 characters')
});
