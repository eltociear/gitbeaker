import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface ProjectRemoteMirrorSchema extends Record<string, unknown> {
  enabled: boolean;
  id: number;
  last_error?: string;
  last_successful_update_at: string;
  last_update_at: string;
  last_update_started_at: string;
  only_protected_branches: boolean;
  keep_divergent_refs: boolean;
  update_status: string;
  url: string;
}

export class ProjectRemoteMirrors<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectRemoteMirrorSchema[], C, E, void>> {
    return RequestHelper.get<ProjectRemoteMirrorSchema[]>()(
      this,
      endpoint`projects/${projectId}/remote_mirrors`,
      options,
    );
  }

  createPullMirror<E extends boolean = false>(
    projectId: string | number,
    url: string,
    mirror: boolean,
    options?: { onlyProtectedBranches?: boolean } & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectRemoteMirrorSchema, C, E, void>> {
    return RequestHelper.post<ProjectRemoteMirrorSchema>()(
      this,
      endpoint`projects/${projectId}/mirror/pull`,
      {
        importUrl: url,
        mirror,
        ...options,
      },
    );
  }

  createPushMirror<E extends boolean = false>(
    projectId: string | number,
    url: string,
    options?: {
      enabled?: boolean;
      onlyProtectedBranches?: boolean;
      keepDivergentRefs?: boolean;
    } & Sudo &
      ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectRemoteMirrorSchema, C, E, void>> {
    return RequestHelper.post<ProjectRemoteMirrorSchema>()(
      this,
      endpoint`projects/${projectId}/remote_mirrors`,
      {
        url,
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    mirrorId: number,
    options?: {
      enabled?: boolean;
      onlyProtectedBranches?: boolean;
      keepDivergentRefs?: boolean;
    } & Sudo &
      ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectRemoteMirrorSchema, C, E, void>> {
    return RequestHelper.post<ProjectRemoteMirrorSchema>()(
      this,
      endpoint`projects/${projectId}/remote_mirrors/${mirrorId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    name: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, `project_aliases/${name}`, options);
  }
}
