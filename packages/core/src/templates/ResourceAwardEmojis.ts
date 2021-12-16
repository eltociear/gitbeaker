import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import { UserSchema } from '../resources/Users';
import {
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface AwardEmojiSchema extends Record<string, unknown> {
  id: number;
  name: string;
  user: UserSchema;
  created_at: string;
  updated_at: string;
  awardable_id: number;
  awardable_type: string;
}

export function url(
  projectId: number | string,
  resourceType: string,
  resourceId: number | string,
  awardId?: number,
  noteId?: number,
) {
  const [pId, rId] = [projectId, resourceId].map(encodeURIComponent);
  const output: (string | number)[] = [pId, resourceType, rId];

  if (noteId) output.push('notes', noteId);

  output.push('award_emoji');

  if (awardId) output.push(awardId);

  return output.join('/');
}

export class ResourceAwardEmojis<C extends boolean = false> extends BaseResource<C> {
  protected resourceType: string;

  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: 'projects', ...options });

    this.resourceType = resourceType;
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    resourceIId: number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<AwardEmojiSchema[], C, E, P>> {
    return RequestHelper.get<AwardEmojiSchema[]>()(
      this,
      url(projectId, this.resourceType, resourceIId),
      options,
    );
  }

  award<E extends boolean = false>(
    projectId: string | number,
    resourceIId: number,
    name: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AwardEmojiSchema, C, E, void>> {
    return RequestHelper.post<AwardEmojiSchema>()(
      this,
      url(projectId, this.resourceType, resourceIId),
      {
        name,
        ...options,
      },
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    resourceIId: number,
    awardId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      url(projectId, this.resourceType, resourceIId, awardId),
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    resourceIId: number,
    awardId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<AwardEmojiSchema, C, E, void>> {
    return RequestHelper.get<AwardEmojiSchema>()(
      this,
      url(projectId, this.resourceType, resourceIId, awardId),
      options,
    );
  }
}
