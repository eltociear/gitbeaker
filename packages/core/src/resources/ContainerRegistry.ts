import { BaseResource } from '@gitbeaker/requester-utils';
import {
  endpoint,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface RegistryRepositoryTagSchema extends Record<string, unknown> {
  name: string;
  path: string;
  location: string;
  revision: string;
  short_revision: string;
  digest: string;
  created_at: string;
  total_size: number;
}

export type CondensedRegistryRepositoryTagSchema = Pick<
  RegistryRepositoryTagSchema,
  'name' | 'path' | 'location'
>;

export interface RegistryRepositorySchema extends Record<string, unknown> {
  id: number;
  name: string;
  path: string;
  project_id: number;
  location: string;
  created_at: string;
  cleanup_policy_started_at: string;
  tags_count?: number;
  tags?: Pick<RegistryRepositoryTagSchema, 'name' | 'path' | 'location'>[];
}

export type CondensedRegistryRepositorySchema = Omit<
  RegistryRepositorySchema,
  'tags' | 'tags_count'
>;

export class ContainerRegistry<C extends boolean = false> extends BaseResource<C> {
  projectRepositories<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<CondensedRegistryRepositorySchema[], C, E, P>> {
    return RequestHelper.get<CondensedRegistryRepositorySchema[]>()(
      this,
      endpoint`projects/${projectId}/registry/repositories`,
      options,
    );
  }

  groupRepositories<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<CondensedRegistryRepositorySchema[], C, E, P>> {
    return RequestHelper.get<CondensedRegistryRepositorySchema[]>()(
      this,
      endpoint`groups/${projectId}/registry/repositories`,
      options,
    );
  }

  showRepository<E extends boolean = false>(
    projectId: string | number,
    repositoryId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RegistryRepositorySchema, C, E, void>> {
    return RequestHelper.get<RegistryRepositorySchema>()(
      this,
      endpoint`projects/${projectId}/registry/repositories/${repositoryId}`,
      options,
    );
  }

  tags<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    repositoryId: number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<CondensedRegistryRepositoryTagSchema[], C, E, P>> {
    return RequestHelper.get<CondensedRegistryRepositoryTagSchema[]>()(
      this,
      endpoint`projects/${projectId}/registry/repositories/${repositoryId}/tags`,
      options,
    );
  }

  removeRepository<E extends boolean = false>(
    projectId: string | number,
    repositoryId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/registry/repositories/${repositoryId}`,
      options,
    );
  }

  removeTag<E extends boolean = false>(
    projectId: string | number,
    repositoryId: number,
    tagName: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/registry/repositories/${repositoryId}/tags/${tagName}`,
      options,
    );
  }

  removeTags<E extends boolean = false>(
    projectId: string | number,
    repositoryId: number,
    nameRegexDelete: string,
    options?: Sudo & { nameRegexKeep: string; keepN: string; olderThan: string } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/registry/repositories/${repositoryId}/tags`,
      {
        nameRegexDelete,
        ...options,
      },
    );
  }

  showTag<E extends boolean = false>(
    projectId: string | number,
    repositoryId: number,
    tagName: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RegistryRepositoryTagSchema, C, E, void>> {
    return RequestHelper.get<RegistryRepositoryTagSchema>()(
      this,
      endpoint`projects/${projectId}/registry/repositories/${repositoryId}/tags/${tagName}`,
      options,
    );
  }
}
