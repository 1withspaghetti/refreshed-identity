import { drizzle } from 'drizzle-orm/d1';
import * as sessionSchema from './schema/session';
import * as userSchema from './schema/user';
import { getRequestEvent } from '$app/server';

export const table = {
	...userSchema,
	...sessionSchema
};

export const getDb = (d1?: D1Database) =>
	drizzle(d1 ?? getRequestEvent().platform!.env.DB, { schema: table });
