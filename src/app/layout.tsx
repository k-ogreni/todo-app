import { TodoProvider } from '@/context/TodoContext';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'My Todo App',
  description: 'My Todo App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TodoProvider>
          <main className="container">
            <Suspense fallback={<p className="loading-text">Loading...</p>}>
              {children}
            </Suspense>
          </main>
          <Toaster position="bottom-right" />
        </TodoProvider>
      </body>
    </html>
  );
}
