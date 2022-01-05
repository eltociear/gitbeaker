import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  GitlabAPIResponse,
} from '../infrastructure';

// Documentation: https://docs.gitlab.com/ee/api/groups.html#ldap-group-links
export class GroupLDAPLinks<C extends boolean = false> extends BaseResource<C> {
  add<E extends boolean = false>(
    groupId: string | number,
    groupAccess: number,
    provider: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    return RequestHelper.post<string>()(this, endpoint`groups/${groupId}/ldap_group_links`, {
      groupAccess,
      provider,
      ...options,
    });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<string[], C, E, P>> {
    return RequestHelper.get<string[]>()(
      this,
      endpoint`groups/${groupId}/ldap_group_links`,
      options as PaginatedRequestOptions<E, P>,
    );
  }

  remove<E extends boolean = false>(
    groupId: string | number,
    provider: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    return RequestHelper.del<string>()(this, endpoint`groups/${groupId}/ldap_group_links`, {
      provider,
      ...options,
    });
  }
}
