import { Octokit } from '@octokit/rest';

export interface GitHubConfig {
  token: string;
}

export class GitHubService {
  private octokit: Octokit;

  constructor(config: GitHubConfig) {
    this.octokit = new Octokit({ auth: config.token });
  }

  async validateToken(): Promise<boolean> {
    try {
      const { data } = await this.octokit.users.getAuthenticated();
      return !!data;
    } catch {
      return false;
    }
  }

  async getOrganizations() {
    const { data } = await this.octokit.orgs.listForAuthenticatedUser();
    return data;
  }

  async getRepositories(org: string) {
    const { data } = await this.octokit.repos.listForOrg({
      org,
      type: 'all',
      sort: 'updated',
      per_page: 100,
    });
    return data;
  }

  async checkWorkflowFile(owner: string, repo: string) {
    try {
      await this.octokit.repos.getContent({
        owner,
        repo,
        path: '.github/workflows/changeset-release.yml',
      });
      return true;
    } catch {
      return false;
    }
  }

  async createReleasePR({
    owner,
    repo,
    type,
    description,
  }: {
    owner: string;
    repo: string;
    type: 'patch' | 'minor' | 'major';
    description: string;
  }) {
    await this.octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: 'changeset-release.yml',
      ref: 'develop',
      inputs: {
        type,
        description,
      },
    });
  }
}