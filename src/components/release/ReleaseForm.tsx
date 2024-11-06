import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { ReleaseFormData, releaseFormSchema } from '@/lib/validation';
import { Combobox } from '@/components/ui/combobox';
import { useOrganizations } from '@/hooks/useOrganizations';
import { useRepositories } from '@/hooks/useRepositories';

interface ReleaseFormProps {
  token: string;
  onSubmit: (data: ReleaseFormData) => Promise<void>;
  onLogout: () => void;
  isLoading: boolean;
}

export function ReleaseForm({ token, onSubmit, onLogout, isLoading }: ReleaseFormProps) {
  const form = useForm<ReleaseFormData>({
    resolver: zodResolver(releaseFormSchema),
    defaultValues: {
      organization: '',
      repository: '',
      type: 'patch',
      description: '',
    },
  });

  const { data: organizations = [], isLoading: isLoadingOrgs } = useOrganizations(token);
  const { data: repositories = [], isLoading: isLoadingRepos } = useRepositories(
    token,
    form.watch('organization')
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Create Release PR</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a repository and provide release details to create a new pull request.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Combobox
                      options={organizations}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue('repository', '');
                      }}
                      placeholder="Select an organization"
                      loading={isLoadingOrgs}
                      searchPlaceholder="Search organizations..."
                      emptyText="No organizations found"
                    />
                  </FormControl>
                  <FormDescription>
                    Select a GitHub organization to view its repositories
                  </FormDescription>
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
                    <Combobox
                      options={repositories}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select a repository"
                      loading={isLoadingRepos}
                      disabled={!form.watch('organization')}
                      searchPlaceholder="Search repositories..."
                      emptyText="No repositories with release workflow found"
                    />
                  </FormControl>
                  <FormDescription>
                    Only repositories with changeset release workflow are shown
                  </FormDescription>
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
                    <div data-color-mode="light">
                      <MDEditor
                        value={field.value}
                        onChange={(value) => field.onChange(value || '')}
                        preview="edit"
                        height={200}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onLogout}
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
      </div>
    </Card>
  );
}