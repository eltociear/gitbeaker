import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type { UserSchema } from './Users';

export type PipelineStatus =
  | 'created'
  | 'waiting_for_resource'
  | 'preparing'
  | 'pending'
  | 'running'
  | 'failed'
  | 'success'
  | 'canceled'
  | 'skipped'
  | 'manual'
  | 'scheduled';

export interface PipelineSchema extends Record<string, unknown> {
  id: number;
  iid: number;
  project_id: number;
  sha: string;
  ref: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  web_url: string;
}

export interface ExpandedPipelineSchema extends PipelineSchema {
  before_sha: string;
  tag: boolean;
  yaml_errors?: unknown;
  user: Omit<UserSchema, 'created_at'>;
  started_at: string;
  finished_at: string;
  committed_at?: string;
  duration: number;
  queued_duration?: unknown;
  coverage?: unknown;
  detailed_status: {
    icon: string;
    text: string;
    label: string;
    group: string;
    tooltip: string;
    has_details: boolean;
    details_path: string;
    illustration?: null;
    favicon: string;
  };
}

export interface PipelineVariableSchema extends Record<string, unknown> {
  key: string;
  variable_type?: string;
  value: string;
}

export interface PipelineTestReportSchema extends Record<string, unknown> {
  total_time: number;
  total_count: number;
  success_count: number;
  failed_count: number;
  skipped_count: number;
  error_count: number;
  test_suites?: PipelineTestSuiteSchema[];
}

export interface PipelineTestSuiteSchema {
  name: string;
  total_time: number;
  total_count: number;
  success_count: number;
  failed_count: number;
  skipped_count: number;
  error_count: number;
  test_cases?: PipelineTestCaseSchema[];
}

export interface PipelineTestCaseSchema {
  status: string;
  name: string;
  classname: string;
  execution_time: number;
  system_output?: string;
  stack_trace?: string;
}

export interface PipelineTestReportSummarySchema extends Record<string, unknown> {
  total: {
    time: number;
    count: number;
    success: number;
    failed: number;
    skipped: number;
    error: number;
    suite_error?: null;
  };
  test_suites?: PipelineTestSuiteSchema[];
}

export class Pipelines<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<PipelineSchema[], C, E, P>> {
    return RequestHelper.get<PipelineSchema[]>()(
      this,
      endpoint`projects/${projectId}/pipelines`,
      options,
    );
  }

  cancel<E extends boolean = false>(
    projectId: string | number,
    pipelineId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ExpandedPipelineSchema, C, E, void>> {
    return RequestHelper.post<ExpandedPipelineSchema>()(
      this,
      endpoint`projects/${projectId}/pipelines/${pipelineId}/cancel`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    ref: string,
    options?: { variables?: PipelineVariableSchema[] } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ExpandedPipelineSchema, C, E, void>> {
    return RequestHelper.post<ExpandedPipelineSchema>()(
      this,
      endpoint`projects/${projectId}/pipeline`,
      {
        ref,
        ...options,
      },
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    pipelineId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/pipelines/${pipelineId}`,
      options,
    );
  }

  retry<E extends boolean = false>(
    projectId: string | number,
    pipelineId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ExpandedPipelineSchema, C, E, void>> {
    return RequestHelper.post<ExpandedPipelineSchema>()(
      this,
      endpoint`projects/${projectId}/pipelines/${pipelineId}/retry`,
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    pipelineId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ExpandedPipelineSchema, C, E, void>> {
    return RequestHelper.get<ExpandedPipelineSchema>()(
      this,
      endpoint`projects/${projectId}/pipelines/${pipelineId}`,
      options,
    );
  }

  showVariables<E extends boolean = false>(
    projectId: string | number,
    pipelineId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineVariableSchema[], C, E, void>> {
    return RequestHelper.get<PipelineVariableSchema[]>()(
      this,
      endpoint`projects/${projectId}/pipelines/${pipelineId}/variables`,
      options,
    );
  }

  showTestReport<E extends boolean = false>(
    projectId: string | number,
    pipelineId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineTestReportSchema, C, E, void>> {
    return RequestHelper.get<PipelineTestReportSchema>()(
      this,
      endpoint`projects/${projectId}/pipelines/${pipelineId}/test_report`,
      options,
    );
  }

  showTestReportSummary<E extends boolean = false>(
    projectId: string | number,
    pipelineId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineTestReportSummarySchema, C, E, void>> {
    return RequestHelper.get<PipelineTestReportSummarySchema>()(
      this,
      endpoint`projects/${projectId}/pipelines/${pipelineId}/test_report_summary`,
      options,
    );
  }
}
