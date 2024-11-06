import { useQuery } from '@tanstack/react-query';
import { GitHubService } from '@/lib/github';

export function useOrganizations(token: string) {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const github = new GitHubService({ token });
      const orgs = await github.getOrganizations();
      return orgs.map(org => ({
        label: org.login,
        value: org.login
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}