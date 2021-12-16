import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import {
  endpoint,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export type AccessLevel = 0 | 5 | 10 | 20 | 30 | 40 | 50;

export interface AccessRequestSchema extends Record<string, unknown> {
  id: number;
  username: string;
  name: string;
  state: string;
  created_at: string;
  requested_at: string;
}

export class ResourceAccessRequests<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    resourceId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<AccessRequestSchema[], C, E, P>> {
    return RequestHelper.get<AccessRequestSchema[]>()(
      this,
      endpoint`${resourceId}/access_requests`,
      options,
    );
  }

  request<E extends boolean = false>(
    resourceId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AccessRequestSchema, C, E, void>> {
    return RequestHelper.post<AccessRequestSchema>()(
      this,
      endpoint`${resourceId}/access_requests`,
      options,
    );
  }

  approve<E extends boolean = false>(
    resourceId: string | number,
    userId: number,
    options?: { accessLevel?: AccessLevel } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AccessRequestSchema, C, E, void>> {
    return RequestHelper.post<AccessRequestSchema>()(
      this,
      endpoint`${resourceId}/access_requests/${userId}/approve`,
      options,
    );
  }

  deny<E extends boolean = false>(
    resourceId: string | number,
    userId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`${resourceId}/access_requests/${userId}`, options);
  }
}
