import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const archivedParam = searchParams.get('archived');

    let fetchedTasks;

    if (archivedParam === 'true') {
      fetchedTasks = db.select().from(tasks).where(eq(tasks.isArchived, 1)).all();
    } else if (archivedParam === 'false') {
      fetchedTasks = db.select().from(tasks).where(eq(tasks.isArchived, 0)).all();
    } else {
      // Default: fetch all if no parameter is provided
      fetchedTasks = db.select().from(tasks).all();
    }

    return NextResponse.json(fetchedTasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, dueDate, topic } = body;

    // Insert a new task. Status and isArchived will use their default values (Todo and 0).
    const newTask = db.insert(tasks).values({
      title,
      description,
      dueDate,
      topic,
    }).returning().get();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}