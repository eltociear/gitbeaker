import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { PaginatedRequestOptions, GitlabAPIResponse } from '../infrastructure';
import type { UserSchema } from './Users';
import type { PipelineSchema } from './Pipelines';
import type { CondensedMergeRequestSchema } from './MergeRequests';

export interface MergeTrainSchema extends Record<string, unknown> {
  id: number;
  merge_request: CondensedMergeRequestSchema;
  user: Omit<UserSchema, 'created_at'>;
  pipeline: PipelineSchema;
  created_at: string;
  updated_at: string;
  target_branch: string;
  status: string;
  merged_at: string;
  duration: number;
}

export class MergeTrains<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options?: { scope?: 'active' | 'complete'; sort?: 'asc' | 'desc' } & PaginatedRequestOptions<
      E,
      P
    >,
  ): Promise<GitlabAPIResponse<MergeTrainSchema[], C, E, P>> {
    return RequestHelper.get<MergeTrainSchema[]>()(
      this,
      endpoint`projects/${projectId}/merge_trains`,
      options,
    );
  }
}
