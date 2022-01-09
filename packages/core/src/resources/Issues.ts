import * as Mime from 'mime/lite';
import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type { UserSchema } from './Users';
import type { MergeRequestSchema } from './MergeRequests';
import type { TodoSchema } from './Todos';
import type { MilestoneSchema } from '../templates/types';
import type { UploadMetadata } from './types';

export interface MetricImageSchema extends Record<string, unknown> {
  id: number;
  created_at: string;
  filename: string;
  file_path: string;
  url: string;
}

export interface UserAgentDetailSchema extends Record<string, unknown> {
  user_agent: string;
  ip_address: string;
  akismet_submitted: boolean;
}

export interface TimeStatsSchema extends Record<string, unknown> {
  time_estimate: number;
  total_time_spent: number;
  human_time_estimate: string;
  human_total_time_spent: string;
}

export interface IssueLinkSchema extends Record<string, unknown> {
  id: number;
  iid: number;
  project_id: number;
  issue_link_id: number;
  state: string;
  description: string;
  weight?: number;
  author: Omit<UserSchema, 'created_at'>;
  milestone: MilestoneSchema;
  assignees?: Omit<UserSchema, 'created_at'>[];
  title: string;
  labels?: string[];
  user_notes_count: number;
  due_date: string;
  web_url: string;
  confidential: boolean;
  updated_at: string;
  link_type: 'relates_to' | 'blocks' | 'is_blocked_by';
  link_created_at: string;
  link_updated_at: string;
}

export interface IssueSchema extends Record<string, unknown> {
  state: string;
  description: string;
  health_status?: string;
  weight?: number;
  author: Omit<UserSchema, 'created_at'>;
  milestone: MilestoneSchema;
  project_id: number;
  assignees?: Omit<UserSchema, 'created_at'>[];
  type: string;
  updated_at: string;
  closed_at?: string;
  closed_by?: string;
  id: number;
  title: string;
  created_at: string;
  moved_to_id?: string;
  iid: number;
  labels?: string[];
  upvotes: number;
  downvotes: number;
  merge_requests_count: number;
  user_notes_count: number;
  due_date: string;
  web_url: string;
  references: {
    short: string;
    relative: string;
    full: string;
  };
  time_stats: TimeStatsSchema;
  has_tasks: boolean;
  task_status: string;
  confidential: boolean;
  discussion_locked: boolean;
  _links: {
    self: string;
    notes: string;
    award_emoji: string;
    project: string;
  };
  task_completion_status: {
    count: number;
    completed_count: number;
  };
  subscribed: boolean;
  epic?: {
    id: number;
    iid: number;
    title: string;
    url: string;
    group_id: number;
  };
}

export class Issues<C extends boolean = false> extends BaseResource<C> {
  addSpentTime<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    duration: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<TimeStatsSchema, C, E, void>> {
    return RequestHelper.post<TimeStatsSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/add_spent_time`,
      {
        duration,
        ...options,
      },
    );
  }

  addTimeEstimate<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    duration: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<TimeStatsSchema, C, E, void>> {
    return RequestHelper.post<TimeStatsSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/time_estimate`,
      {
        duration,
        ...options,
      },
    );
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    {
      projectId,
      groupId,
      ...options
    }: (
      | { projectId?: string | number; groupId?: never }
      | { groupId?: string | number; projectId?: never }
    ) &
      PaginatedRequestOptions<E, P> = {} as any,
  ): Promise<GitlabAPIResponse<IssueSchema[], C, E, P>> {
    let url: string;

    if (projectId) {
      url = endpoint`projects/${projectId}/issues`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/issues`;
    } else {
      url = 'issues';
    }

    return RequestHelper.get<IssueSchema[]>()(this, url, options as PaginatedRequestOptions<E, P>);
  }

  create<E extends boolean = false>(
    projectId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    return RequestHelper.post<IssueSchema>()(this, endpoint`projects/${projectId}/issues`, options);
  }

  createTodo<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<TodoSchema, C, E, void>> {
    return RequestHelper.post<TodoSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/todo`,
      options,
    );
  }

  clone<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    destinationProjectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    return RequestHelper.post<IssueSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/clone`,
      {
        toProjectId: destinationProjectId,
        ...options,
      },
    );
  }

  closedByMergeRequestst<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MergeRequestSchema[], C, E, void>> {
    return RequestHelper.get<MergeRequestSchema[]>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/closed_by`,
      options,
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    return RequestHelper.put<IssueSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}`,
      options,
    );
  }

  metricImages<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MetricImageSchema, C, E, void>> {
    return RequestHelper.get<MetricImageSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/metric_images`,
      options,
    );
  }

  move<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    destinationProjectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    return RequestHelper.post<IssueSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/move`,
      {
        toProjectId: destinationProjectId,
        ...options,
      },
    );
  }

  participants<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Omit<UserSchema, 'created_at'>, C, E, void>> {
    return RequestHelper.get<Omit<UserSchema, 'created_at'>>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/participants`,
      options,
    );
  }

  // Includes /promote already!
  promote<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    body: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    return RequestHelper.post<IssueSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/notes`,
      {
        query: {
          body: `${body} \n /promote`,
        },
        ...options,
      },
    );
  }

  relatedMergeRequests<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MergeRequestSchema[], C, E, void>> {
    return RequestHelper.get<MergeRequestSchema[]>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/related_merge_requests`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`projects/${projectId}/issues/${issueIId}`, options);
  }

  removeMetricImage<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    imageId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/metric_images/${imageId}`,
      options,
    );
  }

  reorder<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    return RequestHelper.put<unknown>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/reorder`,
      options,
    );
  }

  resetSpentTime<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<TimeStatsSchema, C, E, void>> {
    return RequestHelper.post<TimeStatsSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/reset_spent_time`,
      options,
    );
  }

  resetTimeEstimate<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<TimeStatsSchema, C, E, void>> {
    return RequestHelper.post<TimeStatsSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/reset_time_estimate`,
      options,
    );
  }

  show<E extends boolean = false>(
    issueId: number,
    { projectId, ...options }: { projectId?: string | number } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    let url: string;

    if (projectId) {
      url = endpoint`projects/${projectId}/issues/${issueId}`;
    } else {
      url = `issues/${issueId}`;
    }

    return RequestHelper.get<IssueSchema>()(this, url, options as Sudo & ShowExpanded<E>);
  }

  subscribe<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    return RequestHelper.post<IssueSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/subscribe`,
      options,
    );
  }

  timeStats<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<TimeStatsSchema, C, E, void>> {
    return RequestHelper.get<TimeStatsSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/time_stats`,
      options,
    );
  }

  unsubscribe<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<IssueSchema, C, E, void>> {
    return RequestHelper.post<IssueSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/unsubscribe`,
      options,
    );
  }

  uploadMetricImage<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    content: string,
    { metadata, ...options }: { metadata?: UploadMetadata } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<MetricImageSchema, C, E, void>> {
    const meta = {
      filename: `${Date.now().toString()}.tar.gz`,
      ...metadata,
    };

    if (!meta.contentType) meta.contentType = Mime.getType(meta.filename) || undefined;

    return RequestHelper.post<MetricImageSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/metric_images`,
      {
        isForm: true,
        ...options,
        file: [content, meta],
      },
    );
  }

  userAgentDetails<E extends boolean = false>(
    projectId: string | number,
    issueIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<UserAgentDetailSchema, C, E, void>> {
    return RequestHelper.get<UserAgentDetailSchema>()(
      this,
      endpoint`projects/${projectId}/issues/${issueIId}/user_agent_details`,
      options,
    );
  }
}
