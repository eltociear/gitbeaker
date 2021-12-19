import { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceDiscussions } from '../templates';
import {
  DiscussionSchema,
  DiscussionNoteSchema,
  DiscussionNotePositionBaseOptions,
} from '../templates/types';
import {
  PaginatedRequestOptions,
  BaseRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export type MergeRequestDiscussionNotePositionOptions = (
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
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    mergerequestId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<DiscussionSchema[], C, E, P>>;

  create<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    body: string,
    options?: { position?: MergeRequestDiscussionNotePositionOptions } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;

  editNote<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    noteId: number,
    options: BaseRequestOptions<E> & ({ body: string } | { resolved: boolean }),
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>>;

  removeNote<E extends boolean = false>(
    projectId: string | number,
    mergerequestId: string | number,
    discussionId: number,
    noteId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

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
}
