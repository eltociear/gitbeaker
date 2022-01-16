import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceNotes } from '../templates';
import type { NoteSchema } from '../templates/types';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface SnippetNoteSchema extends NoteSchema {
  confidential: boolean;
  file_name: string;
  expires_at: string;
}

export interface ProjectSnippetNotes<C extends boolean = false> extends ResourceNotes<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    snippedId: number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<SnippetNoteSchema[], C, E, P>>;

  create<E extends boolean = false>(
    projectId: string | number,
    snippedId: number,
    body: string,
    options?: { created_at?: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<SnippetNoteSchema, C, E, void>>;

  edit<E extends boolean = false>(
    projectId: string | number,
    snippedId: number,
    noteId: number,
    options: { body: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<SnippetNoteSchema, C, E, void>>;

  remove<E extends boolean = false>(
    projectId: string | number,
    snippedId: number,
    noteId: number,
    options?: Sudo,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  show<E extends boolean = false>(
    projectId: string | number,
    snippedId: number,
    noteId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<SnippetNoteSchema, C, E, void>>;
}

export class ProjectSnippetNotes<C extends boolean = false> extends ResourceNotes<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('projects', 'snippets', options);
  }
}
