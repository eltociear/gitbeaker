import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceRepositoryStorageMoves } from '../templates';
import type { RepositoryStorageMoveSchema } from '../templates/types';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type { GroupSchema } from './Groups';

export interface GroupRepositoryStorageMoveSchema extends RepositoryStorageMoveSchema {
  group: Pick<GroupSchema, 'id' | 'web_url' | 'name'>;
}

export interface GroupRepositoryStorageMoves<C extends boolean = false>
  extends ResourceRepositoryStorageMoves<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    options?: { groupId?: string | number } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<GroupRepositoryStorageMoveSchema[], C, E, P>>;

  show<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    repositoryStorageId: number,
    options?: { groupId?: string | number } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<GroupRepositoryStorageMoveSchema, C, E, P>>;

  schedule<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    sourceStorageName: string,
    options?: { groupId?: string | number } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<GroupRepositoryStorageMoveSchema, C, E, P>>;
}

export class GroupRepositoryStorageMoves<
  C extends boolean = false,
> extends ResourceRepositoryStorageMoves<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('groups', options);
  }
}
