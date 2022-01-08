import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface BaseExternalStatusCheckSchema extends Record<string, unknown> {
  id: number;
  name: string;
  external_url: string;
  status: string;
}

export type MergeRequestExternalStatusCheckSchema = BaseExternalStatusCheckSchema;

export interface ExternalStatusCheckProtectedBranchesSchema {
  id: number;
  project_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  code_owner_approval_required: boolean;
}

export interface ProjectExternalStatusCheckSchema extends BaseExternalStatusCheckSchema {
  project_id: number;
  protected_branches?: ExternalStatusCheckProtectedBranchesSchema[];
}

export class ExternalStatusChecks<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options: { mergerequestIId: number } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<MergeRequestExternalStatusCheckSchema[], C, E, P>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<ProjectExternalStatusCheckSchema[], C, E, P>>;

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    {
      mergerequestIId,
      ...options
    }: { mergerequestIId?: number } & PaginatedRequestOptions<E, P> = {} as any,
  ) {
    let url = endpoint`projects/${projectId}`;

    if (mergerequestIId) {
      url += `/merge_requests/${mergerequestIId}/status_checks`;
    } else {
      url += '/external_status_checks';
    }

    return RequestHelper.get<
      (MergeRequestExternalStatusCheckSchema | ProjectExternalStatusCheckSchema)[]
    >()(this, url, options as PaginatedRequestOptions<E, P>);
  }

  create<E extends boolean = false>(
    projectId: string | number,
    name: string,
    externalUrl: string,
    options?: { protectedBrancheIds: number[] } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectExternalStatusCheckSchema, C, E, void>> {
    return RequestHelper.post<ProjectExternalStatusCheckSchema>()(
      this,
      endpoint`projects/${projectId}/external_status_checks`,
      {
        name,
        externalUrl,
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    externalStatusCheckId: number,
    options?: {
      protectedBrancheIds?: number[];
      externalUrl?: string;
      name?: string;
    } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ProjectExternalStatusCheckSchema, C, E, void>> {
    return RequestHelper.put<ProjectExternalStatusCheckSchema>()(
      this,
      endpoint`projects/${projectId}/external_status_checks/${externalStatusCheckId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    externalStatusCheckId: number,
    options?: { protectedBrancheIds?: number[] } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/external_status_checks/${externalStatusCheckId}`,
      options,
    );
  }

  set<E extends boolean = false>(
    projectId: string | number,
    mergerequestIId: number,
    sha: string,
    externalCheckStatusId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectExternalStatusCheckSchema, C, E, void>> {
    return RequestHelper.post<ProjectExternalStatusCheckSchema>()(
      this,
      endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/status_check_responses`,
      {
        sha,
        externalCheckStatusId,
        ...options,
      },
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    mergerequestIId: number,
    sha: string,
    externalCheckStatusId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectExternalStatusCheckSchema, C, E, void>> {
    return RequestHelper.post<ProjectExternalStatusCheckSchema>()(
      this,
      endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/status_check_responses`,
      {
        sha,
        externalCheckStatusId,
        ...options,
      },
    );
  }
}
