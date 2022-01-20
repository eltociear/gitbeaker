import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';
import type { UserSchema } from './Users';
import type { PipelineSchema, PipelineVariableSchema } from './Pipelines';

export interface CondensedPipelineScheduleSchema extends Record<string, unknown> {
  id: number;
  description: string;
  ref: string;
  cron: string;
  cron_timezone: string;
  next_run_at: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  owner: Omit<UserSchema, 'created_at'>;
}

export interface PipelineScheduleSchema extends CondensedPipelineScheduleSchema {
  last_pipeline: Pick<PipelineSchema, 'id' | 'sha' | 'ref' | 'status'>;
}

export interface ExpandedPipelineScheduleSchema extends PipelineScheduleSchema {
  last_pipeline: Pick<PipelineSchema, 'id' | 'sha' | 'ref' | 'status'>;
  variables: PipelineVariableSchema[];
}

export class PipelineSchedules<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    options?: { scope?: 'active' | 'inactive' } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<CondensedPipelineScheduleSchema[], C, E, void>> {
    return RequestHelper.get<CondensedPipelineScheduleSchema[]>()(
      this,
      endpoint`projects/${projectId}/pipeline_schedules`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    description: string,
    ref: string,
    cron: string,
    options?: { cronTimezone?: string; active?: boolean } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineScheduleSchema, C, E, void>> {
    return RequestHelper.post<PipelineScheduleSchema>()(
      this,
      endpoint`projects/${projectId}/pipeline_schedules`,
      {
        description,
        ref,
        cron,
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    scheduleId: number,
    options?: {
      description?: string;
      ref?: string;
      cron?: string;
      cronTimezone?: string;
      active?: boolean;
    } & Sudo &
      ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineScheduleSchema, C, E, void>> {
    return RequestHelper.put<PipelineScheduleSchema>()(
      this,
      endpoint`projects/${projectId}/pipeline_schedules/${scheduleId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    scheduleId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineScheduleSchema, C, E, void>> {
    return RequestHelper.del<PipelineScheduleSchema>()(
      this,
      endpoint`projects/${projectId}/pipeline_schedules/${scheduleId}`,
      options,
    );
  }

  run<E extends boolean = false>(
    projectId: string | number,
    scheduleId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<{ message: string }, C, E, void>> {
    return RequestHelper.post<{ message: string }>()(
      this,
      endpoint`projects/${projectId}/pipeline_schedules/${scheduleId}/play`,
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    scheduleId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ExpandedPipelineScheduleSchema, C, E, void>> {
    return RequestHelper.get<ExpandedPipelineScheduleSchema>()(
      this,
      endpoint`projects/${projectId}/pipeline_schedules/${scheduleId}`,
      options,
    );
  }

  takeOwnership<E extends boolean = false>(
    projectId: string | number,
    scheduleId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineScheduleSchema, C, E, void>> {
    return RequestHelper.post<PipelineScheduleSchema>()(
      this,
      endpoint`projects/${projectId}/pipeline_schedules/${scheduleId}/take_ownership`,
      options,
    );
  }
}
