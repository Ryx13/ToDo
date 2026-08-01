"use client";

import { useEffect, useState, useCallback } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList, { Task } from "@/components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`/api/tasks?archived=${showArchived}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }, [showArchived]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">COMS3011A Todo List</h1>
        
        {/* Hide creation form when viewing archives to prevent clutter */}
        {!showArchived && <TaskForm onTaskCreated={fetchTasks} />}
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">
            {showArchived ? "Archived Tasks" : "Active Tasks"}
          </h2>
          <button 
            onClick={() => setShowArchived(!showArchived)}
            className="text-sm font-semibold px-4 py-2 bg-gray-200 rounded text-gray-800 hover:bg-gray-300 transition-colors"
          >
            {showArchived ? "Return to Active Tasks" : "View Archived Tasks"}
          </button>
        </div>
        
        <TaskList tasks={tasks} onTaskUpdate={fetchTasks} isArchiveView={showArchived} />
      </div>
    </main>
  );
}