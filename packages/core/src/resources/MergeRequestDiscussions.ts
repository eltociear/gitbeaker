import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceDiscussions } from '../templates';
import type {
  DiscussionSchema,
  DiscussionNoteSchema,
  DiscussionNotePositionSchema,
  DiscussionNotePositionBaseOptions,
} from '../templates/types';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface MergeRequestDiscussionNoteSchema extends DiscussionNoteSchema {
  resolved_by: string;
  resolved_at: string;
  position?: DiscussionNotePositionSchema;
}

export type DiscussionNotePositionOptions = (
  | (DiscussionNotePositionBaseOptions & {
      position_type: 'text';
      new_path: string;
      old_path: string;
    })
  | (DiscussionNotePositionBaseOptions & {
      position_type: 'image';
      new_path?: string;
      old_path?: string;
    })
) & {
  line_range?: {
    start?: {
      line_code: string;
      type: 'new' | 'old';
    };
    end?: {
      line_code: string;
      type: 'new' | 'old';
    };
  };
};

export interface MergeRequestDiscussions<C extends boolean = false> extends ResourceDiscussions<C> {
  addNote<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    noteId: number,
    body: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MergeRequestDiscussionNoteSchema, C, E, void>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    mergerequestId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<DiscussionSchema[], C, E, P>>;

  create<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    body: string,
    options?: { position?: DiscussionNotePositionOptions } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;

  editNote<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    noteId: number,
    options: BaseRequestOptions<E> & { body: string },
  ): Promise<GitlabAPIResponse<MergeRequestDiscussionNoteSchema, C, E, void>>;

  removeNote<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    noteId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  resolve<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    resolve: boolean,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;

  show<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;
}

export class MergeRequestDiscussions<C extends boolean = false> extends ResourceDiscussions<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('projects', 'merge_requests', options);
  }

  resolve<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    resolved: boolean,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>> {
    return RequestHelper.put<DiscussionSchema>()(
      this,
      endpoint`${projectId}/merge_requests/${mergerequestId}/discussions/${discussionId}`,
      {
        query: { resolved },
        ...options,
      },
    );
  }
}
