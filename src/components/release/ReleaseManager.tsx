import { useState } from 'react';
import { toast } from 'sonner';
import { GitHubService } from '@/lib/github';
import { storage } from '@/lib/storage';
import { ReleaseFormData } from '@/lib/validation';
import { AuthForm } from './AuthForm';
import { ReleaseForm } from './ReleaseForm';

export function ReleaseManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [githubToken, setGithubToken] = useState(storage.getToken());

  const handleSubmit = async (data: ReleaseFormData) => {
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
    } catch (error) {
      toast.error('Failed to create release PR');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    storage.removeToken();
    setGithubToken(null);
  };

  if (!githubToken) {
    return <AuthForm onSuccess={setGithubToken} />;
  }

  return (
    <ReleaseForm
      token={githubToken}
      onSubmit={handleSubmit}
      onLogout={handleLogout}
      isLoading={isLoading}
    />
  );
}