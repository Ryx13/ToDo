"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList, { Task } from "@/components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch only active (non-archived) tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks?archived=false");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  // Load tasks on initial mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">COMS3011A Todo List</h1>
        
        <TaskForm onTaskCreated={fetchTasks} />
        
        <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
      </div>
    </main>
  );
}