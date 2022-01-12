import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, GitlabAPIResponse } from '../infrastructure';

export interface StatisticsSchema extends Record<string, unknown> {
  statistics: {
    counts: {
      all: number;
      closed: number;
      opened: number;
    };
  };
}

export class IssuesStatistics<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>({
    projectId,
    groupId,
    ...options
  }: (
    | { projectId?: string | number; groupId?: never }
    | { groupId?: string | number; projectId?: never }
  ) &
    BaseRequestOptions<E> = {}): Promise<GitlabAPIResponse<StatisticsSchema, C, E, void>> {
    let url: string;

    if (projectId) {
      url = endpoint`projects/${projectId}/issues_statistics`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/issues_statistics`;
    } else {
      url = 'issues_statistics';
    }

    return RequestHelper.get<StatisticsSchema>()(this, url, options);
  }
}
