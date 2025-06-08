'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface Todo {
  _id: string;
  task: string;
  completed: boolean;
}

interface TodoContextType {
  todos: Todo[];
  addTodo: (task: string) => Promise<void>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await axios.get<Todo[]>('/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to load todos', err);
      toast.error('Something went wrong. Could not load your todos.');
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (task: string) => {
    const tempId = Date.now().toString();
    const optimistic: Todo = { _id: tempId, task, completed: false };
    setTodos(prev => [...prev, optimistic]);

    try {
      const res = await axios.post<Todo>('/api/todos', { task });
      setTodos(prev =>
        prev.map(todo => (todo._id === tempId ? res.data : todo))
      );
      toast.success('Task added');
    } catch (err) {
      console.error('Failed to add todo', err);
      setTodos(prev => prev.filter(todo => todo._id !== tempId));
      toast.error('Something went wrong. Could not add task.');
    }
  }, []);

  const updateTodo = useCallback(
    async (id: string, data: Partial<Todo>) => {
      setTodos(prev =>
        prev.map(todo => (todo._id === id ? { ...todo, ...data } : todo))
      );
      try {
        const res = await axios.put<Todo>(`/api/todos/${id}`, data);
        setTodos(prev =>
          prev.map(todo => (todo._id === id ? res.data : todo))
        );
        toast.success('Task updated');
      } catch (err) {
        console.error('Failed to update todo', err);
        fetchTodos();
        toast.error('Something went wrong. Could not update task.');
      }
    },
    [fetchTodos]
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      setTodos(prev => prev.filter(todo => todo._id !== id));
      try {
        await axios.delete(`/api/todos/${id}`);
        toast.success('Task deleted');
      } catch (err) {
        console.error('Failed to delete todo', err);
        fetchTodos();
        toast.error('Something went wrong. Could not delete task.');
      }
    },
    [fetchTodos]
  );

  const value = useMemo(
    () => ({ todos, addTodo, updateTodo, deleteTodo }),
    [todos, addTodo, updateTodo, deleteTodo]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};