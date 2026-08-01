import { NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, dueDate, topic, status, isArchived } = body;

    const allowedStatuses = ['Todo', 'In-Progress', 'Complete'];
    if (status !== undefined && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updateData: Partial<typeof tasks.$inferInsert> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    // Convert string/Date input into a numeric Unix timestamp for SQLite
    if (dueDate !== undefined) {
      if (typeof dueDate === 'number') {
        updateData.dueDate = dueDate;
      } else if (typeof dueDate === 'string') {
        // Parse standard date string like "2026-08-01" into midnight local/UTC timestamp
        const timestamp = new Date(dueDate.includes('T') ? dueDate : `${dueDate}T00:00:00`).getTime();
        if (!isNaN(timestamp)) {
          updateData.dueDate = timestamp;
        }
      }
    }

    if (topic !== undefined) updateData.topic = topic;
    if (status !== undefined) updateData.status = status;
    if (isArchived !== undefined) updateData.isArchived = isArchived;

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}