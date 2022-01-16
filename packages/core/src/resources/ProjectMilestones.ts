import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceMilestones } from '../templates';
import type { MilestoneSchema } from '../templates/types';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type { IssueSchema } from './Issues';
import type { MergeRequestSchema } from './MergeRequests';

export interface ProjectMilestones<C extends boolean = false> extends ResourceMilestones<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<MilestoneSchema[], C, E, P>>;

  assignedIssues<E extends boolean = false>(
    projectId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueSchema[], C, E, void>>;

  assignedMergeRequests<E extends boolean = false>(
    projectId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MergeRequestSchema[], C, E, void>>;

  burndownChartEvents<E extends boolean = false>(
    projectId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>>;

  create<E extends boolean = false>(
    projectId: string | number,
    title: string,
    options?: { description?: string; dueDate?: string; startDate?: string } & Sudo &
      ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MilestoneSchema, C, E, void>>;

  edit<E extends boolean = false>(
    projectId: string | number,
    milestoneId: number,
    options?: {
      title?: string;
      description?: string;
      dueDate?: string;
      startDate?: string;
      startEvent?: 'close' | 'activate';
    } & Sudo &
      ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MilestoneSchema, C, E, void>>;

  remove<E extends boolean = false>(
    projectId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  show<E extends boolean = false>(
    projectId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MilestoneSchema, C, E, void>>;
}

export class ProjectMilestones<C extends boolean = false> extends ResourceMilestones<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('projects', options);
  }

  promote<E extends boolean = false>(
    projectId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    return RequestHelper.post<unknown>()(
      this,
      endpoint`${projectId}/milestones/${milestoneId}/promote`,
      options,
    );
  }
}
