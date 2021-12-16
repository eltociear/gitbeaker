import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import { AwardEmojiSchema, url } from './ResourceAwardEmojis';
import {
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export class ResourceNoteAwardEmojis<C extends boolean = false> extends BaseResource<C> {
  protected resourceType: string;

  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: 'projects', ...options });

    this.resourceType = resourceType;
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    resourceIId: number,
    noteId: number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<AwardEmojiSchema[], C, E, P>> {
    return RequestHelper.get<AwardEmojiSchema[]>()(
      this,
      url(projectId, this.resourceType, resourceIId, undefined, noteId),
      options,
    );
  }

  award<E extends boolean = false>(
    projectId: string | number,
    resourceIId: number,
    noteId: number,
    name: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AwardEmojiSchema, C, E, void>> {
    return RequestHelper.post<AwardEmojiSchema>()(
      this,
      url(projectId, this.resourceType, resourceIId, undefined, noteId),
      {
        name,
        ...options,
      },
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    resourceIId: number,
    noteId: number,
    awardId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      url(projectId, this.resourceType, resourceIId, awardId, noteId),
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    resourceIId: number,
    noteId: number,
    awardId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AwardEmojiSchema, C, E, void>> {
    return RequestHelper.get<AwardEmojiSchema>()(
      this,
      url(projectId, this.resourceType, resourceIId, awardId, noteId),
      options,
    );
  }
}
