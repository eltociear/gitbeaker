import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceIterations } from '../templates';
import type { IterationSchema } from '../templates/types';
import type { BaseRequestOptions, GitlabAPIResponse } from '../infrastructure';

export interface ProjectIterations<C extends boolean = false> {
  all<E extends boolean = false>(
    projectId: string | number,
    options?: {
      state?: 'opened' | 'upcoming' | 'current' | 'closed' | 'all';
      search?: string;
      includeAncestors?: boolean;
    } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<IterationSchema[], C, E, void>>
}

export class ProjectIterations<C extends boolean = false> extends ResourceIterations<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('project', options);
  }
}
