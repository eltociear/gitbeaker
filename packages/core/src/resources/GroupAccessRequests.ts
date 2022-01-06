import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceAccessRequests } from '../templates';
import type { AccessRequestSchema, AccessLevel } from '../templates/types';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface GroupAccessRequests<C extends boolean = false> extends ResourceAccessRequests<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<AccessRequestSchema[], C, E, P>>;

  request<E extends boolean = false>(
    groupId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AccessRequestSchema, C, E, void>>;

  approve<E extends boolean = false>(
    groupId: string | number,
    userId: number,
    options?: { accessLevel?: AccessLevel } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AccessRequestSchema, C, E, void>>;

  deny<E extends boolean = false>(
    groupId: string | number,
    userId: number,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;
}

export class GroupAccessRequests<C extends boolean = false> extends ResourceAccessRequests<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('groups', options);
  }
}
