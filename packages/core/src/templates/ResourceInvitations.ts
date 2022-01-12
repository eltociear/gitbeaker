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
import { AccessLevel } from './ResourceAccessRequests';

export interface InvitationSchema extends Record<string, unknown> {
  id: number;
  invite_email: string;
  created_at: string;
  access_level: number;
  expires_at: string;
  user_name: string;
  created_by_name: string;
}

export class ResourceInvitations<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    resourceId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<InvitationSchema[], C, E, P>> {
    return RequestHelper.get<InvitationSchema[]>()(
      this,
      endpoint`${resourceId}/invitations`,
      options,
    );
  }

  invite<E extends boolean = false>(
    resourceId: string | number,
    email: string,
    accessLevel: AccessLevel,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<InvitationSchema, C, E, void>> {
    return RequestHelper.post<InvitationSchema>()(this, endpoint`${resourceId}/invitations`, {
      email,
      accessLevel,
      ...options,
    });
  }

  edit<E extends boolean = false>(
    resourceId: string | number,
    email: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<InvitationSchema, C, E, void>> {
    return RequestHelper.put<InvitationSchema>()(
      this,
      endpoint`${resourceId}/invitations/${email}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    resourceId: string | number,
    email: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<InvitationSchema, C, E, void>> {
    return RequestHelper.put<InvitationSchema>()(
      this,
      endpoint`${resourceId}/invitations/${email}`,
      options,
    );
  }
}
