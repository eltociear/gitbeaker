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
import type { AccessLevel } from './ResourceAccessRequests';

export interface IncludeInherited {
  includeInherited?: boolean;
}

export interface MemberSchema extends Record<string, unknown> {
  id: number;
  username: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
  expires_at: string;
  access_level: AccessLevel;
  email: string;
  group_saml_identity: {
    extern_uid: string;
    provider: string;
    saml_provider_id: number;
  };
}

export class ResourceMembers<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  add<E extends boolean = false>(
    resourceId: string | number,
    userId: number,
    accessLevel: AccessLevel,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>> {
    return RequestHelper.post<MemberSchema>()(this, endpoint`${resourceId}/members`, {
      userId: String(userId),
      accessLevel,
      ...options,
    });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    resourceId: string | number,
    options: IncludeInherited & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<MemberSchema[], C, E, P>> {
    const rId = encodeURIComponent(resourceId);
    const url = [rId, 'members'];

    if (options.includeInherited) url.push('all');

    return RequestHelper.get<MemberSchema[]>()(this, url.join('/'), options);
  }

  edit<E extends boolean = false>(
    resourceId: string | number,
    userId: number,
    accessLevel: AccessLevel,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>> {
    return RequestHelper.put<MemberSchema>()(this, endpoint`${resourceId}/members/${userId}`, {
      accessLevel,
      ...options,
    });
  }

  show<E extends boolean = false>(
    resourceId: string | number,
    userId: number,
    { includeInherited, ...options }: IncludeInherited & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>> {
    const [rId, uId] = [resourceId, userId].map(encodeURIComponent);
    const url = [rId, 'members'];

    if (includeInherited) url.push('all');

    url.push(uId);

    return RequestHelper.get<MemberSchema>()(
      this,
      url.join('/'),
      options as Record<string, unknown>,
    );
  }

  remove<E extends boolean = false>(
    resourceId: string | number,
    userId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`${resourceId}/members/${userId}`, options);
  }
}
