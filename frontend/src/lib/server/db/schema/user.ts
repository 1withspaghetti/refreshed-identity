import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { relations, sql } from 'drizzle-orm';
import { sessions } from './session';

export const users = sqliteTable(
	'users',
	{
		id: text('id').primaryKey(),
		googleId: text('google_id').unique(),
		email: text({ length: 500 }).notNull().unique(),
		name: text({ length: 500 }).notNull(),
		pfp: text({ length: 500 }),
		firstLogin: integer('first_login', { mode: 'timestamp_ms' })
			.default(sql`(unixepoch() * 1000)`)
			.notNull(),
		lastLogin: integer('last_login', { mode: 'timestamp_ms' })
			.default(sql`(unixepoch() * 1000)`)
			.notNull()
	},
	(table) => [
		index('users_google_id_idx').on(table.googleId),
		index('users_email_idx').on(table.email)
	]
);

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions)
}));
