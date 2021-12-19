import { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceDiscussions } from '../templates';
import {
  DiscussionSchema,
  DiscussionNoteSchema,
  DiscussionNotePositionBaseOptions,
} from '../templates/types';
import {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export type CommitDiscussionNotePositionOptions = DiscussionNotePositionBaseOptions & {
  position_type: 'text | image';
  new_path?: string;
  old_path?: string;
};

export interface CommitDiscussions<C extends boolean = false> extends ResourceDiscussions<C> {
  addNote<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    noteId: number,
    body: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    commitId: number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<DiscussionSchema[], C, E, P>>;

  create<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    body: string,
    options: { position?: CommitDiscussionNotePositionOptions } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;

  editNote<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    noteId: number,
    options: BaseRequestOptions<E> & { body: string },
  ): Promise<GitlabAPIResponse<DiscussionNoteSchema, C, E, void>>;

  removeNote<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    noteId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  show<E extends boolean = false>(
    projectId: string | number,
    commitId: number,
    discussionId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DiscussionSchema, C, E, void>>;
}

export class CommitDiscussions<C extends boolean = false> extends ResourceDiscussions<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('projects', 'repository/commits', options);
  }
}
