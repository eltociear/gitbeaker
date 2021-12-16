import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import {
  endpoint,
  BaseRequestOptions,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import { IssueSchema } from '../resources/Issues';
import { MergeRequestSchema } from '../resources/MergeRequests';

export interface MilestoneSchema extends Record<string, unknown> {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  due_date?: string;
  start_date: string;
  state: string;
  updated_at: string;
  created_at: string;
  expired: boolean;
  web_url?: string;
}

export class ResourceMilestones<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    resourceId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<MilestoneSchema[], C, E, P>> {
    return RequestHelper.get<MilestoneSchema[]>()(
      this,
      endpoint`${resourceId}/milestones`,
      options,
    );
  }

  create<E extends boolean = false>(
    resourceId: string | number,
    title: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MilestoneSchema, C, E, void>> {
    return RequestHelper.post<MilestoneSchema>()(this, endpoint`${resourceId}/milestones`, {
      title,
      ...options,
    });
  }

  edit<E extends boolean = false>(
    resourceId: string | number,
    milestoneId: number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<MilestoneSchema, C, E, void>> {
    return RequestHelper.put<MilestoneSchema>()(
      this,
      endpoint`${resourceId}/milestones/${milestoneId}`,
      options,
    );
  }

  issues<E extends boolean = false>(
    resourceId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueSchema[], C, E, void>> {
    return RequestHelper.get<IssueSchema[]>()(
      this,
      endpoint`${resourceId}/milestones/${milestoneId}/issues`,
      options,
    );
  }

  mergeRequests<E extends boolean = false>(
    resourceId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MergeRequestSchema[], C, E, void>> {
    return RequestHelper.get<MergeRequestSchema[]>()(
      this,
      endpoint`${resourceId}/milestones/${milestoneId}/merge_requests`,
      options,
    );
  }

  show<E extends boolean = false>(
    resourceId: string | number,
    milestoneId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MilestoneSchema, C, E, void>> {
    return RequestHelper.get<MilestoneSchema>()(
      this,
      endpoint`${resourceId}/milestones/${milestoneId}`,
      options,
    );
  }
}
