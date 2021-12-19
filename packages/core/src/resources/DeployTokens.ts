import { BaseResource } from '@gitbeaker/requester-utils';
import {
  endpoint,
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
  revoked: boolean;
  expired: boolean;
  scopes?: DeployTokenScope[];
}

export class DeployTokens<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    {
      projectId,
      groupId,
      ...options
    }: (
      | { projectId?: string | number; groupId?: never }
      | { groupId?: string | number; projectId?: never }
    ) &
      PaginatedRequestOptions<E, P> = {} as any,
  ): Promise<GitlabAPIResponse<DeployTokenSchema[], C, E, P>> {
    let url: string;

    if (projectId) {
      url = endpoint`projects/${projectId}/deploy_tokens`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/deploy_tokens`;
    } else {
      url = 'deploy_tokens';
    }

    return RequestHelper.get<DeployTokenSchema[]>()(
      this,
      url,
      options as any as PaginatedRequestOptions<E, P>,
    );
  }

  create<E extends boolean = false>(
    name: string,
    scopes: string[],
    {
      projectId,
      groupId,
      ...options
    }: (
      | { projectId: string | number; groupId?: never }
      | { groupId: string | number; projectId?: never }
    ) &
      Sudo &
      ShowExpanded<E> = {} as any,
  ): Promise<GitlabAPIResponse<DeployTokenSchema, C, E, void>> {
    let url: string;

    if (projectId) {
      url = endpoint`projects/${projectId}/deploy_tokens`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/deploy_tokens`;
    } else {
      throw new Error('Either a projectId or groupId must be passed in the options parameter');
    }

    return RequestHelper.post<DeployTokenSchema>()(this, url, {
      name,
      scopes,
      ...options,
    });
  }

  remove<E extends boolean = false>(
    tokenId: number,
    {
      projectId,
      groupId,
      ...options
    }: (
      | { projectId: string | number; groupId?: never }
      | { groupId: string | number; projectId?: never }
    ) &
      Sudo &
      ShowExpanded<E> = {} as any,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    let url: string;

    if (projectId) {
      url = endpoint`projects/${projectId}/deploy_tokens/${tokenId}`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/deploy_tokens/${tokenId}`;
    } else {
      throw new Error('Either a projectId or groupId must be passed in the options parameter');
    }

    return RequestHelper.del()(this, url, options as any as Sudo & ShowExpanded<E>);
  }
}
