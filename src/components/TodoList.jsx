import React from "react";
import { Plus, X } from "lucide-react";
import "./TodoList.css";

export default function TodoList({
  todos,
  newTodo,
  setNewTodo,
  addTodo,
  toggleTodo,
  deleteTodo,
  showTodoList,
  setShowTodoList,
}) {
  return (
    <div className="fixed top-6 left-6 z-150">
      <button
        onClick={() => setShowTodoList(!showTodoList)}
        className="p-4 bg-gray-800 border border-gray-700 hover:bg-zinc-800 rounded-full transition-colors"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="13" y2="14" />
        </svg>
      </button>

      {showTodoList && (
        <div className="mt-3 w-80 bg-zinc-900 rounded-3xl p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">To Do List</h3>
          </div>

          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                placeholder="Add a task..."
                className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addTodo}
                className="p-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto todo-container">
            {todos.map((todo, index) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-zinc-800 rounded-2xl group todo-item"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span
                  className={`flex-1 text-sm ${
                    todo.completed ? "line-through text-zinc-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded-full transition-all"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
