import z from 'zod/v4';
import { idValidator } from './idValidator';

export const identityCreateSchema = z.object({
	deadname: z.string().min(1, 'Name is required').max(500, 'Name cannot exceed 500 characters'),
    email: z.email().max(500, 'Email cannot exceed 500 characters'),
    replacement: z.string().min(1, 'Replacement is required').max(500, 'Replacement cannot exceed 500 characters')
});

export const identityEditSchema = z.object({
    id: idValidator,
	deadname: z.string().min(1, 'Name is required').max(500, 'Name cannot exceed 500 characters'),
    email: z.email().max(500, 'Email cannot exceed 500 characters'),
    replacement: z.string().min(1, 'Replacement is required').max(500, 'Replacement cannot exceed 500 characters')
});

export const identityDeleteSchema = z.object({
	id: idValidator
});
