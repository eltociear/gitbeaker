import { BaseResource } from '@gitbeaker/requester-utils';
import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface RepositoryStorageMoveSchema {
  id: number;
  created_at: string;
  state: string;
  source_storage_name: string;
  destination_storage_name: string;
}

export class ResourceRepositoryStorageMoves<C extends boolean = false> extends BaseResource<C> {
  protected resourceType: string;

  protected resourceTypeSingular: string;

  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super(options);

    this.resourceType = resourceType;
    this.resourceTypeSingular = resourceType.substring(0, resourceType.length - 1);
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    options?: { resourceId?: string | number } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<RepositoryStorageMoveSchema[], C, E, P>> {
    const resourceId = options?.[`${this.resourceTypeSingular}Id`] as string | number;
    const url = resourceId
      ? endpoint`${this.resourceType}/${resourceId}/repository_storage_moves`
      : `${this.resourceTypeSingular}_repository_storage_moves`;

    return RequestHelper.get<RepositoryStorageMoveSchema[]>()(
      this,
      url,
      options as PaginatedRequestOptions<E, P>,
    );
  }

  show<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    repositoryStorageId: number,
    options?: { resourceId?: string | number } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RepositoryStorageMoveSchema, C, E, P>> {
    const resourceId = options?.[`${this.resourceTypeSingular}Id`] as string | number;
    const url = resourceId
      ? endpoint`${this.resourceType}/${resourceId}/repository_storage_moves`
      : `${this.resourceTypeSingular}_repository_storage_moves`;

    return RequestHelper.get<RepositoryStorageMoveSchema>()(
      this,
      `${url}/${repositoryStorageId}`,
      options as Sudo & ShowExpanded<E>,
    );
  }

  schedule<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    sourceStorageName: string,
    options?: { resourceId?: string | number } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<RepositoryStorageMoveSchema, C, E, P>> {
    const resourceId = options?.[`${this.resourceTypeSingular}Id`] as string | number;
    const url = resourceId
      ? endpoint`${this.resourceType}/${resourceId}/repository_storage_moves`
      : `${this.resourceTypeSingular}_repository_storage_moves`;

    return RequestHelper.post<RepositoryStorageMoveSchema>()(this, url, {
      sourceStorageName,
      ...(options as Sudo & ShowExpanded<E>),
    });
  }
}
