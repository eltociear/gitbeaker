import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceLabels } from '../templates';
import type { LabelSchema } from '../templates/types';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface ProjectLabels<C extends boolean = false> extends ResourceLabels<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<LabelSchema[], C, E, P>>;

  create<E extends boolean = false>(
    projectId: string | number,
    labelName: string,
    color: string,
    options?: { description?: string; priority?: number } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>>;

  edit<E extends boolean = false>(
    projectId: string | number,
    labelId: number | string,
    options?: ({ newName: string; color: never } | { newName: never; color: string }) & {
      description?: string;
      priority?: number;
    } & Sudo &
      ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>>;

  promote<E extends boolean = false>(
    projectId: string | number,
    labelId: number | string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>>;

  remove<E extends boolean = false>(
    projectId: string | number,
    labelId: number | string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  subscribe<E extends boolean = false>(
    projectId: string | number,
    labelId: number | string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>>;

  unsubscribe<E extends boolean = false>(
    projectId: string | number,
    labelId: number | string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>>;
}

export class ProjectLabels<C extends boolean = false> extends ResourceLabels<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('projects', options);
  }
}
