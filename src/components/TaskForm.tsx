"use client";

import { useState } from "react";

export default function TaskForm({ onTaskCreated }: { onTaskCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [topic, setTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const timestamp = new Date(`${dueDate}T00:00:00`).getTime();

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          dueDate: timestamp,
          topic,
        }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setDueDate("");
        setTopic("");
        onTaskCreated();
      }
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-sm bg-white mb-6">
      <h2 className="text-xl font-bold mb-4">Create New Task</h2>
      
      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 rounded text-black"
        />
        
        <div className="flex gap-4">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="border p-2 rounded text-black flex-1"
          />
          
          <input
            type="text"
            placeholder="Topic (e.g., COMS3011A)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="border p-2 rounded text-black flex-1"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isSubmitting ? "Saving..." : "Add Task"}
        </button>
      </div>
    </form>
  );
}