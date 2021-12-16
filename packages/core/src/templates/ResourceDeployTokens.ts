import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import {
  endpoint,
  BaseRequestOptions,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export type DeployTokenScope =
  | 'read_repository'
  | 'read_registry'
  | 'write_registry'
  | 'read_package_registry'
  | 'write_package_registry';

export interface DeployTokenSchema extends Record<string, unknown> {
  id: number;
  name: string;
  username: string;
  expires_at: string;
  scopes?: string[];
}

// https://docs.gitlab.com/ee/api/deploy_tokens.html
export class ResourceDeployTokens<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  add<E extends boolean = false>(
    resourceId: string | number,
    tokenName: string,
    tokenScopes: DeployTokenScope[],
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DeployTokenSchema, C, E, void>> {
    return RequestHelper.post<DeployTokenSchema>()(this, endpoint`${resourceId}/deploy_tokens`, {
      name: tokenName,
      scopes: tokenScopes,
      ...options,
    });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    options: {
      resourceId?: string | number;
      projectId?: string | number;
      groupId?: string | number;
    } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<DeployTokenSchema[], C, E, P>> {
    const prefix =
      options.resourceId || options.projectId || options.groupId
        ? endpoint`${(options.resourceId || options.projectId || options.groupId) as string}/`
        : '';

    return RequestHelper.get<DeployTokenSchema[]>()(this, `${prefix}deploy_tokens`, options);
  }

  remove<E extends boolean = false>(
    resourceId: string | number,
    tokenId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`${resourceId}/deploy_tokens/${tokenId}`, options);
  }
}
