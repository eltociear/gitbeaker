import { BaseResource } from '@gitbeaker/requester-utils';
import { CommitSchema } from './Commits';
import {
  endpoint,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIRecordResponse,
  GitlabAPIResponse,
} from '../infrastructure';

export interface BranchSchema extends Record<string, unknown> {
  name: string;
  merged: boolean;
  protected: boolean;
  default: boolean;
  developers_can_push: boolean;
  developers_can_merge: boolean;
  can_push: boolean;
  web_url: string;
  commit: Omit<CommitSchema, 'web_url' | 'created_at'>;
}

export class Branches<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<P, E>,
  ): Promise<GitlabAPIResponse<C, E, P, BranchSchema[]>> {
    return RequestHelper.get<BranchSchema[]>()(
      this,
      endpoint`projects/${projectId}/repository/branches`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    branchName: string,
    ref: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIRecordResponse<C, E, BranchSchema>> {
    return RequestHelper.post<BranchSchema>()(
      this,
      endpoint`projects/${projectId}/repository/branches`,
      {
        branch: branchName,
        ref,
        ...options,
      },
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    branchName: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIRecordResponse<C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/repository/branches/${branchName}`,
      options,
    );
  }

  removeMerged<E extends boolean = false>(
    projectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIRecordResponse<C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/repository/merged_branches`,
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    branchName: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIRecordResponse<C, E, BranchSchema>> {
    return RequestHelper.get<BranchSchema>()(
      this,
      endpoint`projects/${projectId}/repository/branches/${branchName}`,
      options,
    );
  }
}
