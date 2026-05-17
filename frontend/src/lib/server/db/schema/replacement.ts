import { blob, index, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./user";
import { relations } from "drizzle-orm";

export const replacements = sqliteTable(
	'replacements',
	{
		id: text().primaryKey(),
		userId: text('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		deadname: text({ length: 500 }).notNull(),
        email: text({ length: 500 }),
        replacement: text({ length: 500 }).notNull(),
		hash: blob().notNull()
	},
	(table) => [index('replacements_user_id_idx').on(table.userId), index('replacements_deadname_idx').on(table.deadname), index('replacements_email_idx').on(table.email), index('replacements_hash_idx').on(table.hash)]
);

export const replacementsRelations = relations(replacements, ({ one }) => ({
	user: one(users, {
		fields: [replacements.userId],
		references: [users.id]
	})
}));