import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  created_at: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
});

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: integer('author_id').references(() => users.id),
  created_at: integer('created_at').notNull().default(sql`(strftime('%s', 'now'))`),
  updated_at: integer('updated_at').notNull().default(sql`(strftime('%s', 'now'))`),
});