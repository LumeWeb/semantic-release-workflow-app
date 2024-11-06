import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Github } from 'lucide-react';
import { GitHubService } from '@/lib/github';
import { storage } from '@/lib/storage';
import { toast } from 'sonner';

interface AuthFormProps {
  onSuccess: (token: string) => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = formData.get('token') as string;

    setIsLoading(true);
    try {
      const github = new GitHubService({ token });
      const isValid = await github.validateToken();

      if (isValid) {
        storage.setToken(token);
        onSuccess(token);
        toast.success('GitHub token validated successfully');
      } else {
        toast.error('Invalid GitHub token');
      }
    } catch (error) {
      toast.error('Failed to validate GitHub token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">GitHub Authentication</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your GitHub token to get started. The token needs repository and workflow permissions.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">GitHub Token</Label>
            <Input
              id="token"
              name="token"
              type="password"
              placeholder="ghp_..."
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-4 w-4" />
            )}
            Authenticate with GitHub
          </Button>
        </form>
      </div>
    </Card>
  );
}