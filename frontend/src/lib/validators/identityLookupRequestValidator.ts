import { z } from 'zod';

const hashValidator = z
	.base64('Must be a valid base64 input')
	.length(44, 'Must represent 32 bytes (44 chars)');

export const identityLookupHashRequestValidator = z.object({
	hash: hashValidator
});

export const identityLookupHashManyRequestValidator = z
	.array(hashValidator)
	.min(1, 'Must have at least 1 element')
	.max(100, 'Max 100 elements at a time');

export const identityLookupEmailRequestValidator = z.object({
	email: z.email('Must be a valid email').max(500, 'Must be at most 500 characters')
});

export const identityLookupEmailManyRequestValidator = z.array(
	z.email('Must be a valid email').max(500, 'Must be at most 500 characters')
);
