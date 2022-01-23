import { BaseResource } from '@gitbeaker/requester-utils';
import { RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface ProjectAliasSchema extends Record<string, unknown> {
  id: number;
  project_id: string | number;
  name: string;
}

export class ProjectAliases<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectAliasSchema[], C, E, void>> {
    return RequestHelper.get<ProjectAliasSchema[]>()(this, 'project_aliases', options);
  }

  create<E extends boolean = false>(
    projectId: string | number,
    name: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectAliasSchema, C, E, void>> {
    return RequestHelper.post<ProjectAliasSchema>()(this, 'project_aliases', {
      name,
      projectId,
      ...options,
    });
  }

  edit<E extends boolean = false>(
    name: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ProjectAliasSchema, C, E, void>> {
    return RequestHelper.post<ProjectAliasSchema>()(this, `project_aliases/${name}`, options);
  }

  remove<E extends boolean = false>(
    name: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, `project_aliases/${name}`, options);
  }
}
