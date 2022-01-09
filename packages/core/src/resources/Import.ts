import { BaseResource } from '@gitbeaker/requester-utils';
import { RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, GitlabAPIResponse } from '../infrastructure';

export const defaultMetadata = {
  filename: `${Date.now().toString()}.tgz`,
};

export interface RepositoryImportStatusSchema extends Record<string, unknown> {
  id: number;
  name: string;
  full_path: string;
  full_name: string;
}

export class Import<C extends boolean = false> extends BaseResource<C> {
  importGithubRepository<E extends boolean = false>(
    personalAccessToken: string,
    repositoryId: number,
    targetNamespace: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<RepositoryImportStatusSchema, C, E, void>> {
    return RequestHelper.post<RepositoryImportStatusSchema>()(this, 'import/github', {
      personalAccessToken,
      repoId: repositoryId,
      targetNamespace,
      ...options,
    });
  }

  importBitbucketServerRepository<E extends boolean = false>(
    bitbucketServerUrl: string,
    bitbucketServerUsername: string,
    personalAccessToken: string,
    bitbucketServerProject: string,
    bitbucketServerRepository: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<RepositoryImportStatusSchema, C, E, void>> {
    return RequestHelper.post<RepositoryImportStatusSchema>()(this, 'import/bitbucket_server', {
      bitbucketServerUrl,
      bitbucketServerUsername,
      personalAccessToken,
      bitbucketServerProject,
      bitbucketServerRepo: bitbucketServerRepository,
      ...options,
    });
  }
}
