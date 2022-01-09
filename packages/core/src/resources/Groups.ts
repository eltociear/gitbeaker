import * as Mime from 'mime/lite';
import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type { CondensedProjectSchema, ExpandedProjectSchema } from './Projects';
import type { NamespaceSchema } from './Namespaces';
import type { UploadMetadata } from './types';

// TODO: Why is this type different then the defined project / simple project types?
export interface GroupProjectSchema extends Record<string, unknown> {
  id: number;
  description: string;
  default_branch: string;
  topics?: string[];
  archived: boolean;
  visibility: string;
  ssh_url_to_repo: string;
  http_url_to_repo: string;
  web_url: string;
  name: string;
  name_with_namespace: string;
  path: string;
  path_with_namespace: string;
  issues_enabled: boolean;
  merge_requests_enabled: boolean;
  wiki_enabled: boolean;
  jobs_enabled: boolean;
  snippets_enabled: boolean;
  created_at: string;
  last_activity_at: string;
  shared_runners_enabled: boolean;
  creator_id: number;
  namespace: Pick<NamespaceSchema, 'id' | 'name' | 'path' | 'kind'>;
  avatar_url?: null;
  star_count: number;
  forks_count: number;
  open_issues_count: number;
  public_jobs: boolean;
  shared_with_groups?: string[];
  request_access_enabled: boolean;
}

export interface CondensedGroupSchema extends Record<string, unknown> {
  id: number;
  name: string;
  path: string;
  description: string;
}

export interface SimpleGroupSchema extends CondensedGroupSchema {
  visibility: string;
  avatar_url?: null;
  web_url: string;
  request_access_enabled: boolean;
  full_name: string;
  full_path: string;
  file_template_project_id: number;
  parent_id?: null;
  created_at: string;
  prevent_sharing_groups_outside_hierarchy?: boolean;
}

export interface GroupSchema extends SimpleGroupSchema {
  share_with_group_lock: boolean;
  require_two_factor_authentication: boolean;
  two_factor_grace_period: number;
  project_creation_level: string;
  auto_devops_enabled?: null;
  subgroup_creation_level: string;
  emails_disabled?: null;
  mentions_disabled?: null;
  lfs_enabled: boolean;
  default_branch_protection: number;
  statistics?: {
    storage_size: number;
    repository_size: number;
    wiki_size: number;
    lfs_objects_size: number;
    job_artifacts_size: number;
    pipeline_artifacts_size: number;
    packages_size: number;
    snippets_size: number;
    uploads_size: number;
  };
}

export interface ExpandedGroupSchema extends GroupSchema {
  runners_token: string;
  file_template_project_id: number;
  shared_with_groups?: GroupProjectSchema[];
  projects?: GroupProjectSchema[];
  shared_projects?: GroupProjectSchema[];
}

export class Groups<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<GroupSchema[], C, E, P>> {
    return RequestHelper.get<GroupSchema[]>()(this, 'groups', options);
  }

  create<E extends boolean = false>(
    name: string,
    path: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<GroupSchema, C, E, void>> {
    return RequestHelper.post<GroupSchema>()(this, 'groups', { name, path, ...options });
  }

  createLDAPLink(
    groupId: string | number,
    cn: string,
    groupAccess: number,
    provider: string,
    options?: Sudo & ShowExpanded,
  ) {
    return RequestHelper.post()(this, endpoint`groups/${groupId}/ldap_group_links`, {
      cn,
      groupAccess,
      provider,
      ...options,
    });
  }

  decendantGroups<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<GroupSchema[], C, E, P>> {
    return RequestHelper.get<GroupSchema[]>()(
      this,
      endpoint`groups/${groupId}/descendant_groups`,
      options,
    );
  }

  downloadAvatar<E extends boolean = false>(
    groupId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(this, endpoint`groups/${groupId}/avatar`, options);
  }

  edit<E extends boolean = false>(
    groupId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<SimpleGroupSchema, C, E, void>> {
    return RequestHelper.put<SimpleGroupSchema>()(this, endpoint`groups/${groupId}`, options);
  }

  projects<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options: { simple: true; sharedOnly?: boolean } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<CondensedProjectSchema[], C, E, P>>;
  projects<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<ExpandedProjectSchema[], C, E, P>> {
    return RequestHelper.get()(this, endpoint`groups/${groupId}/projects`, options) as any;
  }

  remove<E extends boolean = false>(
    groupId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`groups/${groupId}`, options);
  }

  removeLDAPLink(
    groupId: string | number,
    cn: string,
    { provider, ...options }: Sudo & ShowExpanded & { provider?: string } = {},
  ) {
    const gId = encodeURIComponent(groupId);
    const url = provider ? `${provider}/${cn}` : `${cn}`;

    return RequestHelper.del()(
      this,
      `groups/${gId}/ldap_group_links/${url}`,
      options as Record<string, unknown>,
    );
  }

  restore<E extends boolean = false>(
    groupId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.post<void>()(this, endpoint`groups/${groupId}/restore`, options);
  }

  search<E extends boolean = false>(
    nameOrPath: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<CondensedGroupSchema[], C, E, void>> {
    return RequestHelper.get<CondensedGroupSchema[]>()(this, 'groups', {
      search: nameOrPath,
      ...options,
    });
  }

  share<E extends boolean = false>(
    groupId: string | number,
    sharedGroupId: string | number,
    groupAccess: number,
    options: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ExpandedGroupSchema, C, E, void>> {
    return RequestHelper.post<ExpandedGroupSchema>()(this, endpoint`groups/${groupId}/share`, {
      groupId: sharedGroupId,
      groupAccess,
      ...options,
    });
  }

  sharedProjects<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options: { simple: true } & PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<CondensedProjectSchema[], C, E, P>>;
  sharedProjects<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<ExpandedProjectSchema[], C, E, P>> {
    return RequestHelper.get()(this, endpoint`groups/${groupId}/projects/shared`, options) as any;
  }

  show<E extends boolean = false>(
    groupId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ExpandedGroupSchema, C, E, void>> {
    return RequestHelper.get<ExpandedGroupSchema>()(this, endpoint`groups/${groupId}`, options);
  }

  subgroups<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    groupId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<GroupSchema[], C, E, P>> {
    return RequestHelper.get<GroupSchema[]>()(this, endpoint`groups/${groupId}/subgroups`, options);
  }

  syncLDAP(groupId: string | number, options?: Sudo & ShowExpanded) {
    return RequestHelper.post()(this, endpoint`groups/${groupId}/ldap_sync`, options);
  }

  transfer<E extends boolean = false>(
    groupId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.post<void>()(this, endpoint`groups/${groupId}/transfer`, options);
  }

  transferProject<E extends boolean = false>(
    groupId: string | number,
    projectId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.post<void>()(
      this,
      endpoint`groups/${groupId}/projects/${projectId}`,
      options,
    );
  }

  unshare<E extends boolean = false>(
    groupId: string | number,
    sharedGroupId: string | number,
    options: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`groups/${groupId}/share/${sharedGroupId}`, options);
  }

  uploadAvatar<E extends boolean = false>(
    groupId: string | number,
    content: string,
    {
      metadata,
      ...options
    }: { parentId?: number; metadata?: UploadMetadata } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    const meta = { ...metadata };

    if (!meta.contentType && meta.filename)
      meta.contentType = Mime.getType(meta.filename) || undefined;

    return RequestHelper.post<unknown>()(this, endpoint`groups/${groupId}/avatar`, {
      isForm: true,
      ...options,
      file: [content, meta],
    });
  }
}
