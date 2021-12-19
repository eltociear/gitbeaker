import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import { UserSchema } from '../resources/Users';
import {
  endpoint,
  BaseRequestOptions,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface DiscussionNotePositionBaseOptions {
  base_sha: string;
  start_sha: string;
  head_sha: string;
  old_line?: number;
  new_line?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface DiscussionNotePositionSchema extends Record<string, unknown> {
  base_sha: string;
  start_sha: string;
  head_sha: string;
  position_type: 'text' | 'image';
  old_path?: string;
  new_path?: string;
  old_line?: number;
  new_line?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface DiscussionNoteSchema extends Record<string, unknown> {
  id: number;
  type?: string;
  body: string;
  attachment?: string;
  author: Omit<UserSchema, 'created_at'>;
  created_at: string;
  updated_at: string;
  system: boolean;
  noteable_id: number;
  noteable_type: string;
  noteable_iid?: number;
  resolvable: boolean;
  position?: DiscussionNotePositionSchema;
}

export interface DiscussionSchema extends Record<string, unknown> {
  id: string;
  individual_note: boolean;
  notes?: DiscussionNoteSchema[];
}

export class ResourceDiscussions<C extends boolean = false> extends BaseResource<C> {
  protected resource2Type: string;

  constructor(resourceType: string, resource2Type: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });

    this.resource2Type = resource2Type;
  }

  addNote<E extends boolean = false>(
    resourceId: string | number,
    resource2Id: string | number,
    discussionId: string | number,
    noteId: number,
    body: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>> {
    return RequestHelper.post<DiscussionNoteSchema>()(
      this,
      endpoint`${resourceId}/${this.resource2Type}/${resource2Id}/discussions/${discussionId}/notes`,
      { query: { body }, noteId, ...options },
    );
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    resourceId: string | number,
    resource2Id: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<DiscussionSchema[], C, E, P>> {
    return RequestHelper.get<DiscussionSchema[]>()(
      this,
      endpoint`${resourceId}/${this.resource2Type}/${resource2Id}/discussions`,
      options,
    );
  }

  create<E extends boolean = false>(
    resourceId: string | number,
    resource2Id: string | number,
    body: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>> {
    return RequestHelper.post<DiscussionSchema>()(
      this,
      endpoint`${resourceId}/${this.resource2Type}/${resource2Id}/discussions`,
      {
        query: { body },
        ...options,
      },
    );
  }

  editNote<E extends boolean = false>(
    resourceId: string | number,
    resource2Id: string | number,
    discussionId: string | number,
    noteId: number,
    { body, ...options }: BaseRequestOptions<E> & { body?: string } = {},
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>> {
    return RequestHelper.put<DiscussionNoteSchema>()(
      this,
      endpoint`${resourceId}/${this.resource2Type}/${resource2Id}/discussions/${discussionId}/notes/${noteId}`,
      {
        query: { body },
        ...options,
      },
    );
  }

  removeNote<E extends boolean = false>(
    resourceId: string | number,
    resource2Id: string | number,
    discussionId: string | number,
    noteId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`${resourceId}/${this.resource2Type}/${resource2Id}/discussions/${discussionId}/notes/${noteId}`,
      options,
    );
  }

  show<E extends boolean = false>(
    resourceId: string | number,
    resource2Id: string | number,
    discussionId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>> {
    return RequestHelper.get<DiscussionSchema>()(
      this,
      endpoint`${resourceId}/${this.resource2Type}/${resource2Id}/discussions/${discussionId}`,
      options,
    );
  }
}
