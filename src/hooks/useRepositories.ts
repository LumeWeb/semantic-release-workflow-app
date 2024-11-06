import { useQuery } from '@tanstack/react-query';
import { GitHubService } from '@/lib/github';

export function useRepositories(token: string, org: string) {
  return useQuery({
    queryKey: ['repositories', org],
    queryFn: async () => {
      const github = new GitHubService({ token });
      const repos = await github.getRepositories(org);
      const filtered = await Promise.all(
        repos.map(async repo => {
          const hasWorkflow = await github.checkWorkflowFile(org, repo.name);
          return hasWorkflow ? {
            label: repo.name,
            value: repo.name
          } : null;
        })
      );
      return filtered.filter(Boolean);
    },
    enabled: !!org,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}