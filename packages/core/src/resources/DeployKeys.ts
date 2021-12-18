import { BaseResource } from '@gitbeaker/requester-utils';
import {
  BaseRequestOptions,
  endpoint,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface DeployKeySchema extends Record<string, unknown> {
  id: number;
  title: string;
  key: string;
  can_push?: boolean;
  created_at: string;
}

export type CondensedDeployKeySchema = Omit<DeployKeySchema, 'can_push'>;

export interface ExpandedDeployKeySchema extends CondensedDeployKeySchema {
  fingerprint: string;
  projects_with_write_access?: CondensedProjectSchema[];
}

export interface CondensedProjectSchema {
  id: number;
  description?: null;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  created_at: string;
}

export class DeployKeys<C extends boolean = false> extends BaseResource<C> {
  add<E extends boolean = false>(
    projectId: string | number,
    title: string,
    key: string,
    options?: { canPush?: boolean } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DeployKeySchema, C, E, void>> {
    return RequestHelper.post<DeployKeySchema>()(
      this,
      endpoint`projects/${projectId}/deploy_keys`,
      {
        title,
        key,
        ...options,
      },
    );
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    options?: { projectId?: string | number } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<ExpandedDeployKeySchema[], C, E, P>> {
    const { projectId, ...opts } = options || {};
    let url: string;

    if (projectId) {
      url = endpoint`projects/${projectId}/deploy_keys`;
    } else {
      url = 'deploy_keys';
    }

    return RequestHelper.get<ExpandedDeployKeySchema[]>()(
      this,
      url,
      opts as PaginatedRequestOptions<E, P>,
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    keyId: number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DeployKeySchema, C, E, void>> {
    return RequestHelper.put<DeployKeySchema>()(
      this,
      endpoint`projects/${projectId}/deploy_keys/${keyId}`,
      options,
    );
  }

  enable<E extends boolean = false>(
    projectId: string | number,
    keyId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<CondensedDeployKeySchema, C, E, void>> {
    return RequestHelper.post<CondensedDeployKeySchema>()(
      this,
      endpoint`projects/${projectId}/deploy_keys/${keyId}/enable`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    keyId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`projects/${projectId}/deploy_keys/${keyId}`, options);
  }

  show<E extends boolean = false>(
    projectId: string | number,
    keyId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DeployKeySchema, C, E, void>> {
    return RequestHelper.get<DeployKeySchema>()(
      this,
      endpoint`projects/${projectId}/deploy_keys/${keyId}`,
      options,
    );
  }
}
