import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { tasks } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { isOverdue } from '../src/lib/overdue';

describe('Task Database Behaviors', () => {
  let sqlite: Database.Database;
  let db: ReturnType<typeof drizzle>;

  beforeEach(() => {
    // Spin up a throwaway in-memory database for deterministic testing
    sqlite = new Database(':memory:');
    db = drizzle(sqlite, { schema: { tasks } });

    // Replicate the schema structure for the in-memory instance
    sqlite.exec(`
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        due_date INTEGER NOT NULL,
        topic TEXT NOT NULL,
        status TEXT DEFAULT 'Todo' NOT NULL,
        is_archived INTEGER DEFAULT 0 NOT NULL
      )
    `);
  });

  afterEach(() => {
    sqlite.close();
  });

  it('1. should successfully create a task with all mandatory fields', () => {
    const timestamp = new Date('2026-12-01T00:00:00').getTime();

    const newTask = db.insert(tasks).values({
      title: 'Complete CPTS Module',
      description: 'Finish the Active Directory enumeration section.',
      dueDate: timestamp,
      topic: 'Cybersecurity',
    }).returning().get();

    expect(newTask).toBeDefined();
    expect(newTask.title).toBe('Complete CPTS Module');
    expect(newTask.topic).toBe('Cybersecurity');
    expect(newTask.status).toBe('Todo'); // Default value
    expect(newTask.isArchived).toBe(0);  // Default value
  });

  it('2. should archive a task by updating the flag, not deleting the row', () => {
    // Insert a dummy task
    const insertedTask = db.insert(tasks).values({
      title: 'Task to Archive',
      description: 'This will be archived.',
      dueDate: Date.now(),
      topic: 'General',
    }).returning().get();

    // Perform the archive action (updating the flag to 1)
    const archivedTask = db.update(tasks)
      .set({ isArchived: 1 })
      .where(eq(tasks.id, insertedTask.id))
      .returning()
      .get();

    // Verify the record still exists and the flag is toggled
    const fetchedTasks = db.select().from(tasks).all();

    expect(fetchedTasks.length).toBe(1);
    expect(archivedTask.isArchived).toBe(1);
  });

  it('3. should dynamically flag a task as overdue using the real application logic', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    // Create a task with a due date in the past (1 day ago)
    const pastTimestamp = todayTimestamp - (24 * 60 * 60 * 1000);

    const pastTask = db.insert(tasks).values({
      title: 'Overdue Task',
      description: 'This task was due yesterday.',
      dueDate: pastTimestamp,
      topic: 'General',
    }).returning().get();

    const result = isOverdue(
      pastTask.dueDate,
      pastTask.status,
      pastTask.isArchived,
      todayTimestamp
    );

    expect(result).toBe(true);
    const completedResult = isOverdue(
      pastTimestamp,
      'Complete',
      0,
      todayTimestamp
    );
    expect(completedResult).toBe(false);
  });
});
