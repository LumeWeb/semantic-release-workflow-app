import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ReleaseManager } from '@/components/release/ReleaseManager';
import { ThemeProvider } from '@/components/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Release Management</h1>
              <p className="mt-2 text-muted-foreground">Create and manage release pull requests across your repositories</p>
            </header>
            <ReleaseManager />
          </div>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;