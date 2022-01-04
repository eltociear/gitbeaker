import { BaseResource } from '@gitbeaker/requester-utils';
import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface WikiSchema extends Record<string, unknown> {
  content: string;
  format: string;
  slug: string;
  title: string;
}

export class ResourceWikis<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    resourceId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<WikiSchema[], C, E, P>> {
    return RequestHelper.get<WikiSchema[]>()(this, endpoint`${resourceId}/wikis`, options);
  }

  create<E extends boolean = false>(
    resourceId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<WikiSchema, C, E, void>> {
    return RequestHelper.post<WikiSchema>()(this, endpoint`${resourceId}/wikis`, options);
  }

  edit<E extends boolean = false>(
    resourceId: string | number,
    slug: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<WikiSchema, C, E, void>> {
    return RequestHelper.put<WikiSchema>()(this, endpoint`${resourceId}/wikis/${slug}`, options);
  }

  remove<E extends boolean = false>(
    resourceId: string | number,
    slug: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`${resourceId}/wikis/${slug}`, options);
  }

  show<E extends boolean = false>(
    resourceId: string | number,
    slug: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<WikiSchema, C, E, void>> {
    return RequestHelper.get<WikiSchema>()(this, endpoint`${resourceId}/wikis/${slug}`, options);
  }
}
