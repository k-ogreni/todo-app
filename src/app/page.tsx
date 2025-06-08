import TodoForm from '@/components/Form/TodoForm';
import TodoList from '@/components/List/TodoList';

export default function HomePage() {
  return (
    <div className="container">
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Todo App</h1>
      <TodoForm />
        <TodoList />
    </div>
  );
}