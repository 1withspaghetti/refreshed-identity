import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user';
import { relations } from 'drizzle-orm';

export const sessions = sqliteTable(
	'sessions',
	{
		id: text().primaryKey(),
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull()
	},
	(table) => [index('sessions_user_id_idx').on(table.userId)]
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

export type Session = typeof sessions.$inferSelect;
