import { BaseResource } from '@gitbeaker/requester-utils';
import { CommitSchema } from './Commits';
import { PipelineSchema } from './Pipelines';
import { UserSchema } from './Users';
import { RunnerSchema } from './Runners';
import { EnvironmentSchema } from './Environments';
import { MergeRequestSchema } from './MergeRequests';
import {
  endpoint,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export type DeploymentStatus = 'created' | 'running' | 'success' | 'failed' | 'canceled';

export interface DeployableSchema {
  id: number;
  ref: string;
  name: string;
  runner?: RunnerSchema;
  stage?: string;
  started_at?: Date;
  status?: DeploymentStatus;
  tag: boolean;
  commit?: CommitSchema;
  coverage?: string;
  created_at?: Date;
  finished_at?: Date;
  user?: UserSchema;
  pipeline?: PipelineSchema;
}

export type DeploymentSchema = {
  id: number;
  iid: number;
  ref: string;
  sha: string;
  user: UserSchema;
  created_at: string;
  updated_at: string;
  status: DeploymentStatus;
  deployable: DeployableSchema;
  environment: EnvironmentSchema;
};

export class Deployments<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<DeploymentSchema[], C, E, P>> {
    return RequestHelper.get<DeploymentSchema[]>()(
      this,
      endpoint`projects/${projectId}/deployments`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    environment: string,
    sha: string,
    ref: string,
    tag: string,
    options?: { status?: DeploymentStatus } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DeploymentSchema, C, E, void>> {
    return RequestHelper.post<DeploymentSchema>()(
      this,
      endpoint`projects/${projectId}/deployments`,
      {
        environment,
        sha,
        ref,
        tag,
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    deploymentId: number,
    options?: { status?: DeploymentStatus } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DeploymentSchema, C, E, void>> {
    return RequestHelper.put<DeploymentSchema>()(
      this,
      endpoint`projects/${projectId}/deployments/${deploymentId}`,
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    deploymentId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DeploymentSchema, C, E, void>> {
    return RequestHelper.get<DeploymentSchema>()(
      this,
      endpoint`projects/${projectId}/deployments/${deploymentId}`,
      options,
    );
  }

  mergeRequests<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    deploymentId: number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<MergeRequestSchema[], C, E, P>> {
    return RequestHelper.get<MergeRequestSchema[]>()(
      this,
      endpoint`projects/${projectId}/deployments/${deploymentId}/merge_requests`,
      options,
    );
  }
}
