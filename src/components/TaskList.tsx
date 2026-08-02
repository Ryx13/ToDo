"use client";

import { useState } from "react";
import { isOverdue as checkOverdue } from "@/lib/overdue";

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: number;
  topic: string;
  status: string;
  isArchived: number;
};

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  isArchiveView: boolean;
}

export default function TaskList({ tasks, onTaskUpdate, isArchiveView }: TaskListProps) {
  const [sortBy, setSortBy] = useState<"dueDate" | "topic" | "status">("dueDate");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Task>>({});

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "dueDate") return a.dueDate - b.dueDate;
    if (sortBy === "topic") return a.topic.localeCompare(b.topic);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const handleUpdate = async (id: number, payload: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setEditingId(null);
        onTaskUpdate();
      }
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    
    // Extract local date components to avoid UTC timezone shifts
    const dateObj = new Date(task.dueDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    setEditData({ ...task, dueDate: formattedDate as any }); 
  };

  const saveEdit = (id: number) => {
    const timestamp = new Date(`${editData.dueDate}T00:00:00`).getTime();
    handleUpdate(id, {
      title: editData.title,
      description: editData.description,
      dueDate: timestamp,
      topic: editData.topic,
      status: editData.status,
    });
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center bg-white p-3 rounded shadow-sm border border-gray-200">
        <span className="font-semibold text-gray-700">Sort Tasks by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "dueDate" | "topic" | "status")}
          className="border p-2 rounded text-black bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="dueDate">Due Date</option>
          <option value="topic">Topic</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-md">
            No tasks found in this view.
          </div>
        ) : (
          sortedTasks.map((task) => {
            const isOverdue = checkOverdue(task.dueDate, task.status, task.isArchived, todayTimestamp);

            if (editingId === task.id) {
              return (
                <div key={task.id} className="p-4 border-2 border-blue-400 rounded-md shadow-sm bg-blue-50 text-black">
                  <input
                    type="text"
                    value={editData.title || ""}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="border p-2 w-full mb-2 rounded"
                  />
                  <textarea
                    value={editData.description || ""}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="border p-2 w-full mb-2 rounded"
                  />
                  <div className="flex gap-2 mb-4">
                    <input
                      type="date"
                      value={editData.dueDate as any || ""}
                      onChange={(e) => setEditData({ ...editData, dueDate: e.target.value as any })}
                      className="border p-2 rounded flex-1"
                    />
                    <input
                      type="text"
                      value={editData.topic || ""}
                      onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
                      className="border p-2 rounded flex-1"
                    />
                    <select
                      value={editData.status || ""}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      className="border p-2 rounded flex-1"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(task.id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">Cancel</button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={task.id}
                className={`p-4 border-2 rounded-md shadow-sm bg-white text-black transition-colors ${
                  isOverdue ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {task.title}
                    {isOverdue && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold uppercase tracking-wider">
                        Overdue
                      </span>
                    )}
                  </h3>
                  <span className="text-sm font-semibold px-2 py-1 bg-gray-200 rounded text-gray-700">
                    {task.topic}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{task.description}</p>
                
                <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
                  <div className="flex gap-4 items-center">
                    <span className={`font-medium ${isOverdue ? 'text-red-700' : 'text-gray-700'}`}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span className="font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      Status: {task.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditing(task)} className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors">Edit</button>
                    {!isArchiveView ? (
                       <button onClick={() => handleUpdate(task.id, { isArchived: 1 })} className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 transition-colors">Archive</button>
                    ) : (
                       <button onClick={() => handleUpdate(task.id, { isArchived: 0 })} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">Unarchive</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}