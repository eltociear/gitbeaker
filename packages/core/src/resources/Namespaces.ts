import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface NamespaceSchema extends Record<string, unknown> {
  id: number;
  name: string;
  path: string;
  kind: string;
  full_path: string;
  parent_id?: number;
  avatar_url: string;
  web_url: string;
  members_count_with_descendants: number;
  billable_members_count: number;
  plan: string;
  trial_ends_on?: string;
  trial: boolean;
}

export class Namespaces<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    options?: { search?: string; ownedOnly?: string } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<NamespaceSchema[], C, E, P>> {
    return RequestHelper.get<NamespaceSchema[]>()(this, 'namespaces', options);
  }

  exists<E extends boolean = false>(
    namespaceId: string | number,
    options?: { parentId?: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<NamespaceSchema, C, E, void>> {
    return RequestHelper.get<NamespaceSchema>()(
      this,
      endpoint`namespaces/${namespaceId}/exists`,
      options,
    );
  }

  show<E extends boolean = false>(
    namespaceId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<NamespaceSchema, C, E, void>> {
    return RequestHelper.get<NamespaceSchema>()(this, endpoint`namespaces/${namespaceId}`, options);
  }
}
