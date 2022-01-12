import { BaseResource } from '@gitbeaker/requester-utils';
import { RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';
import type { ExpandedUserSchema } from './Users';

export interface KeySchema extends Record<string, unknown> {
  id: number;
  title: string;
  key: string;
  created_at: string;
  expires_at: string;
  user: ExpandedUserSchema;
}

export class Keys<C extends boolean = false> extends BaseResource<C> {
  show<E extends boolean = false>({
    keyId,
    fingerprint,
    ...options
  }: ({ keyId: number; fingerprint: never } | { fingerprint: string; keyId: never }) &
    Sudo &
    ShowExpanded<E>): Promise<GitlabAPIResponse<KeySchema, C, E, void>> {
    let url: string;

    if (keyId) {
      url = `keys/${keyId}`;
    } else if (fingerprint) {
      url = `keys?fingerprint=${fingerprint}`;
    } else {
      throw new Error('keyId or fingerprint must be passed');
    }

    return RequestHelper.get<KeySchema>()(this, url, { ...options });
  }
}
