import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceMembers } from '../templates';
import type { MemberSchema, IncludeInherited, AccessLevel } from '../templates/types';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface ProjectMembers<C extends boolean = false> extends ResourceMembers<C> {
  add<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    accessLevel: AccessLevel,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options: IncludeInherited & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<MemberSchema[], C, E, P>>;

  edit<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    accessLevel: AccessLevel,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>>;

  show<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    options?: IncludeInherited & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MemberSchema, C, E, void>>;

  remove<E extends boolean = false>(
    projectId: string | number,
    userId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;
}

export class ProjectMembers<C extends boolean = false> extends ResourceMembers<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('projects', options);
  }
}
