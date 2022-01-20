import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface PersonalAccessTokenSchema extends Record<string, unknown> {
  id: number;
  name: string;
  revoked: boolean;
  created_at: string;
  scopes?: string[];
  user_id: number;
  last_used_at: string;
  active: boolean;
  expires_at?: string;
}

export type PersonalAccessTokenScopes =
  | 'api'
  | 'read_user'
  | 'read_api'
  | 'read_repository'
  | 'write_repository';

export class PersonalAccessTokens<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    options?: { userId?: number } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PersonalAccessTokenSchema[], C, E, void>> {
    return RequestHelper.get<PersonalAccessTokenSchema[]>()(
      this,
      'personal_access_tokens',
      options,
    );
  }

  create<E extends boolean = false>(
    userId: number,
    name: string,
    scopes: PersonalAccessTokenScopes,
    options?: { expires_at?: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PersonalAccessTokenSchema, C, E, void>> {
    return RequestHelper.get<PersonalAccessTokenSchema>()(
      this,
      `user/${userId}/personal_access_tokens`,
      {
        name,
        scopes,
        ...options,
      },
    );
  }

  remove<E extends boolean = false>(
    tokenId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`personal_access_tokens/${tokenId}`, options);
  }
}
