"use client";

import { useState } from "react";

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
}

export default function TaskList({ tasks, onTaskUpdate }: TaskListProps) {
  const [sortBy, setSortBy] = useState<"dueDate" | "topic" | "status">("dueDate");

  // Sort tasks dynamically based on the selected criteria
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "dueDate") return a.dueDate - b.dueDate;
    if (sortBy === "topic") return a.topic.localeCompare(b.topic);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  // Calculate local midnight for accurate overdue comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center bg-white p-3 rounded shadow-sm border border-gray-200">
        <span className="font-semibold text-gray-700">Sort Active Tasks by:</span>
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
            No active tasks found.
          </div>
        ) : (
          sortedTasks.map((task) => {
            // Overdue is derived at read-time: past due date and not already complete
            const isOverdue = task.dueDate < todayTimestamp && task.status !== "Complete";
            
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
                  <span className={`font-medium ${isOverdue ? 'text-red-700' : 'text-gray-700'}`}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className="font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    Status: {task.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}