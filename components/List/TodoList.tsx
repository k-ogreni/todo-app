'use client';
import { useState } from 'react';
import { useTodos } from '@/context/TodoContext';
import type { Todo } from '@/context/TodoContext';
import './TodoList.css';

export default function TodoList() {
  const { todos, updateTodo, deleteTodo } = useTodos();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState('');

  const startEditing = (id: string, task: string) => {
    setEditingId(id);
    setEditedTask(task);
  };

  const saveEdit = async (id: string) => {
    if (editedTask.trim()) {
      await updateTodo(id, { task: editedTask });
    }
    setEditingId(null);
    setEditedTask('');
  };

  if (!todos) {
    return (
      <div className="loading-text" role="alert">Loading todos...</div>
    );
  }

  if (todos.length === 0) {
    return <div role="alert">No todos found.</div>;
  }

  return (
    <section aria-label="Todo List">
      <ul className="todo-list" aria-live="polite">
        {todos.map((todo: Todo) => (
          <li
            key={todo._id}
            className={`todo-item${todo.completed ? ' completed' : ''}`}
          >
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodo(todo._id, { completed: !todo.completed })}
                aria-label={`Mark task "${todo.task}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
            </label>

            {editingId === todo._id ? (
              <input
                className="edit-input editing"
                value={editedTask}
                onChange={e => setEditedTask(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') saveEdit(todo._id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
                aria-label={`Edit task "${todo.task}"`}
              />
            ) : (
              <span className="todo-name">{todo.task}</span>
            )}

            {editingId === todo._id ? (
              <button onClick={() => saveEdit(todo._id)} aria-label={`Save edits to "${todo.task}"`}>Save</button>
            ) : (
              <button onClick={() => startEditing(todo._id, todo.task)} aria-label={`Edit task "${todo.task}"`}>Edit</button>
            )}

            <button onClick={() => deleteTodo(todo._id)} aria-label={`Delete task "${todo.task}"`}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
