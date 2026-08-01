"use client";

import TaskForm from "@/components/TaskForm";

export default function Home() {
  const fetchTasks = () => {
    // We will implement the fetching and state management in Commit 7
    console.log("Task created! Fetching updated list...");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">COMS3011A Todo List</h1>
        
        <TaskForm onTaskCreated={fetchTasks} />
        
        {/* The Task List and sorting controls will go here in the next commit */}
        <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-md">
          Task list will be rendered here.
        </div>
      </div>
    </main>
  );
}