import { BaseResource } from '@gitbeaker/requester-utils';
import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, GitlabAPIResponse } from '../infrastructure';

export interface IterationSchema extends Record<string, unknown> {
  id: number;
  iid: number;
  group_id: number;
  title: string;
  description: string;
  state: number;
  created_at: string;
  updated_at: string;
  due_date: string;
  start_date: string;
  web_url: string;
}

export class ResourceIterations<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  all<E extends boolean = false>(
    resourceId: string | number,
    options?: {
      state?: 'opened' | 'upcoming' | 'current' | 'closed' | 'all';
      search?: string;
      includeAncestors?: boolean;
    } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<IterationSchema[], C, E, void>> {
    return RequestHelper.get<IterationSchema[]>()(
      this,
      endpoint`${resourceId}/iterations`,
      options,
    );
  }
}
