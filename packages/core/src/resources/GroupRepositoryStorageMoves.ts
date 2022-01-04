import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type { GroupSchema } from './Groups';

export interface GroupRepositoryStorageMoveSchema {
  id: number;
  created_at: string;
  state: string;
  source_storage_name: string;
  destination_storage_name: string;
  group: Pick<GroupSchema, 'id' | 'web_url' | 'name'>;
}

export class GroupRepositoryStorageMoves<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    {
      groupId,
      ...options
    }: { groupId?: string | number } & PaginatedRequestOptions<E, P> = {} as any,
  ): Promise<GitlabAPIResponse<GroupRepositoryStorageMoveSchema[], C, E, P>> {
    const urlPrefix = groupId ? endpoint`groups/${groupId}/` : '';

    return RequestHelper.get<GroupRepositoryStorageMoveSchema[]>()(
      this,
      `${urlPrefix}group_repository_storage_moves`,
      options as PaginatedRequestOptions<E, P>,
    );
  }

  show<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    repositoryStorageId: number,
    { groupId, ...options }: { groupId?: string | number } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<GroupRepositoryStorageMoveSchema, C, E, P>> {
    const urlPrefix = groupId ? endpoint`groups/${groupId}/` : '';

    return RequestHelper.get<GroupRepositoryStorageMoveSchema>()(
      this,
      `${urlPrefix}repository_storage_moves/${repositoryStorageId}`,
      options as Sudo & ShowExpanded<E>,
    );
  }

  schedule<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    sourceStorageName: string,
    {
      groupId,
      ...options
    }: { groupId?: string | number; destinationStorageName?: string } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<GroupRepositoryStorageMoveSchema, C, E, P>> {
    const urlPrefix = groupId ? endpoint`groups/${groupId}/` : '';

    return RequestHelper.post<GroupRepositoryStorageMoveSchema>()(
      this,
      `${urlPrefix}repository_storage_moves`,
      {
        sourceStorageName,
        ...(options as Sudo & ShowExpanded<E>),
      },
    );
  }
}
