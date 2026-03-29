import { useEffect } from 'react';
import AppRoutes from './app/AppRoutes';
import { useAuth } from './features/auth/hooks/useAuth';
import { useSelector } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-stone-200 dark:border-stone-800 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <span className="font-display text-sm text-stone-400 dark:text-stone-600 italic">
        The Chronicle
      </span>
    </div>
  </div>
);

const AppContent = () => {
  const { handleGetMe } = useAuth();
  const initialising = useSelector((s) => s.auth.initialising);

  useEffect(() => {
    handleGetMe();
  }, [handleGetMe]);

  if (initialising) return <Spinner />;

  return <AppRoutes />;
};

const App = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;