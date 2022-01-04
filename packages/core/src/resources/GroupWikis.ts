import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceWikis } from '../templates';
import type { WikiSchema } from '../templates/types';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface GroupWikis<C extends boolean = false> extends ResourceWikis<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<WikiSchema[], C, E, P>>;

  // TODO: The create method in the docs only operates on the projects api, is this an error?
  create<E extends boolean = false>(
    groupId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<WikiSchema, C, E, void>>;

  edit<E extends boolean = false>(
    groupId: string | number,
    slug: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<WikiSchema, C, E, void>>;

  remove<E extends boolean = false>(
    groupId: string | number,
    slug: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  show<E extends boolean = false>(
    groupId: string | number,
    slug: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<WikiSchema, C, E, void>>;
}

export class GroupWikis<C extends boolean = false> extends ResourceWikis<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('groups', options);
  }
}
