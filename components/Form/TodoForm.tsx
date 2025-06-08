'use client';
import { useState, useCallback } from 'react';
import { useTodos } from '@/context/TodoContext';
import debounce from 'lodash.debounce';
import './TodoForm.css';

export default function TodoForm() {
  const { addTodo } = useTodos();
  const [task, setTask] = useState('');

  const debouncedAddTodo = useCallback(
    debounce(async (value: string) => {
      await addTodo(value);
    }, 300),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    debouncedAddTodo(task);
    setTask('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <label htmlFor="taskInput" className="sr-only"/>
      <input
        id="taskInput"
        className="input"
        placeholder="New task..."
        value={task}
        onChange={e => setTask(e.target.value)}
        name="task"
        aria-label="New task"
      />
      <button type="submit" className="btn" aria-label="Add task">Add</button>
    </form>
  );
}
