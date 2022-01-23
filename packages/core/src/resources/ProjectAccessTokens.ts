import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';
import type { AccessLevel } from '../templates/types';

export type ProjectAccessTokenScopes =
  | 'api'
  | 'read_api'
  | 'read_registry'
  | 'write_registry'
  | 'read_repository'
  | 'write_repository';

export interface ProjectAccessTokenSchema extends Record<string, unknown> {
  user_id: number;
  scopes?: ProjectAccessTokenScopes[];
  name: string;
  expires_at: string;
  id: number;
  active: boolean;
  created_at: string;
  revoked: boolean;
  access_level: number;
}

export class ProjectAccessTokens<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectAccessTokenSchema[], C, E, void>> {
    return RequestHelper.get<ProjectAccessTokenSchema[]>()(
      this,
      endpoint`projects/${projectId}/access_tokens`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    name: string,
    scopes: ProjectAccessTokenScopes[],
    options?: { accessLevel?: AccessLevel; expiresAt?: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectAccessTokenSchema, C, E, void>> {
    return RequestHelper.post<ProjectAccessTokenSchema>()(
      this,
      endpoint`projects/${projectId}/access_tokens`,
      {
        name,
        scopes,
        ...options,
      },
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    tokenId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/access_tokens/${tokenId}`,
      options,
    );
  }
}
