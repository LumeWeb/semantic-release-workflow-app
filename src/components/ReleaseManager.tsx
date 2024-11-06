import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { GitHubService } from '@/lib/github';
import { storage } from '@/lib/storage';
import { ReleaseFormData, releaseFormSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Github } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

export function ReleaseManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [githubToken, setGithubToken] = useState(storage.getToken());

  const form = useForm<ReleaseFormData>({
    resolver: zodResolver(releaseFormSchema),
    defaultValues: {
      organization: '',
      repository: '',
      type: 'patch',
      description: '',
    },
  });

  const handleTokenSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = formData.get('token') as string;

    setIsLoading(true);
    try {
      const github = new GitHubService({ token });
      const isValid = await github.validateToken();

      if (isValid) {
        storage.setToken(token);
        setGithubToken(token);
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

  const onSubmit = async (data: ReleaseFormData) => {
    if (!githubToken) return;

    setIsLoading(true);
    try {
      const github = new GitHubService({ token: githubToken });
      await github.createReleasePR({
        owner: data.organization,
        repo: data.repository,
        type: data.type,
        description: data.description,
      });

      toast.success('Release PR created successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to create release PR');
    } finally {
      setIsLoading(false);
    }
  };

  if (!githubToken) {
    return (
      <div className="container max-w-lg mx-auto py-10">
        <Card className="p-6">
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="space-y-2">
              <FormLabel>GitHub Token</FormLabel>
              <Input
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
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repository"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository</FormLabel>
                  <FormControl>
                    <Input placeholder="Repository name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="patch">Patch</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change Description</FormLabel>
                  <FormControl>
                    <MDEditor
                      value={field.value}
                      onChange={(value) => field.onChange(value || '')}
                      preview="edit"
                      height={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  storage.removeToken();
                  setGithubToken(null);
                }}
              >
                Logout
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Release PR
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}