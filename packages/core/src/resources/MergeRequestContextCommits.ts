import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface MergeRequestContextCommitSchema extends Record<string, unknown> {
  id: string;
  short_id: string;
  created_at: string;
  parent_ids?: null;
  title: string;
  message: string;
  author_name: string;
  author_email: string;
  authored_date: string;
  committer_name: string;
  committer_email: string;
  committed_date: string;
}

export class IssueLinks<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    mergerequestIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<MergeRequestContextCommitSchema[], C, E, void>> {
    return RequestHelper.get<MergeRequestContextCommitSchema[]>()(
      this,
      endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/context_commits`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    commits: string[],
    options?: { mergerequestIId?: number } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    let url: string;

    if (options?.mergerequestIId) {
      url = endpoint`projects/${projectId}/merge_requests/${options.mergerequestIId}/context_commits`;
    } else {
      url = endpoint`projects/${projectId}/merge_requests`;
    }

    return RequestHelper.post<unknown>()(this, url, {
      commits,
      ...options,
    });
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    mergerequestIId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/merge_requests/${mergerequestIId}/context_commits`,
      options,
    );
  }
}
