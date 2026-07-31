import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  dueDate: integer('due_date').notNull(),
  topic: text('topic').notNull(),
  status: text('status').notNull().default('Todo'), 
  isArchived: integer('is_archived').notNull().default(0), 
});