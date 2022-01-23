import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface PipelineTriggerSchema extends Record<string, unknown> {
  id: number;
  description: string;
  created_at: string;
  last_used?: null;
  token: string;
  updated_at: string;
  owner?: null;
}

export class PipelineTriggers<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineTriggerSchema[], C, E, void>> {
    return RequestHelper.get<PipelineTriggerSchema[]>()(
      this,
      endpoint`projects/${projectId}/triggers`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    description: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineTriggerSchema, C, E, void>> {
    return RequestHelper.post<PipelineTriggerSchema>()(
      this,
      endpoint`projects/${projectId}/triggers`,
      {
        description,
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    triggerId: number,
    options?: { description?: string } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineTriggerSchema, C, E, void>> {
    return RequestHelper.put<PipelineTriggerSchema>()(
      this,
      endpoint`projects/${projectId}/triggers/${triggerId}`,
      options,
    );
  }

  removet<E extends boolean = false>(
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

  show<E extends boolean = false>(
    projectId: string | number,
    triggerId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PipelineTriggerSchema, C, E, void>> {
    return RequestHelper.get<PipelineTriggerSchema>()(
      this,
      endpoint`projects/${projectId}/triggers/${triggerId}`,
      options,
    );
  }
}
