import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';
import type { UserSchema } from './Users';
import type { CommitSchema } from './Commits';
import type { MilestoneSchema } from '../templates/types';

export interface ReleaseEvidence {
  sha: string;
  filepath: string;
  collected_at: string;
}

export interface ReleaseAssetSource {
  format: string;
  url: string;
}

export interface ReleaseAssetLink {
  id: number;
  name: string;
  url: string;
  external: boolean;
  link_type: string;
}

export interface ReleaseSchema extends Record<string, unknown> {
  tag_name: string;
  description: string;
  name: string;
  description_html: string;
  created_at: string;
  released_at: string;
  user: Omit<UserSchema, 'created_at'>;
  commit: CommitSchema;
  milestones?: MilestoneSchema[];
  commit_path: string;
  tag_path: string;
  assets: {
    count: number;
    sources?: ReleaseAssetSource[];
    links?: ReleaseAssetLink[];
    evidence_file_path: string;
  };
  evidences?: ReleaseEvidence[];
}

export class Releases<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<ReleaseSchema[], C, E, P>> {
    return RequestHelper.get<ReleaseSchema[]>()(
      this,
      endpoint`projects/${projectId}/releases`,
      options,
    );
  }

  create<E extends boolean = false>(projectId: string | number, options?: BaseRequestOptions<E>): Promise<GitlabAPIResponse<ReleaseSchema, C, E, void>> {
    return RequestHelper.post<ReleaseSchema>()(
      this,
      endpoint`projects/${projectId}/releases`,
      options,
    );
  }

  createEvidence<E extends boolean = false>(projectId: string | number, tagName: string, options?: Sudo & ShowExpanded<E>): Promise<GitlabAPIResponse<number, C, E, void>> {
    return RequestHelper.post<number>()(
      this,
      endpoint`projects/${projectId}/releases/${tagName}/evidence`,
      options,
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    tagName: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ReleaseSchema, C, E, void>> {
    return RequestHelper.put<ReleaseSchema>()(
      this,
      endpoint`projects/${projectId}/releases/${tagName}`,
      options,
    );
  }

  remove<E extends boolean = false>(projectId: string | number, tagName: string, options?: Sudo & ShowExpanded<E>): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`projects/${projectId}/releases/${tagName}`, options);
  }

  show<E extends boolean = false>(projectId: string | number, tagName: string, options?: {includeHtmlDescription?: boolean } & Sudo & ShowExpanded<E>): Promise<GitlabAPIResponse<ReleaseSchema, C, E, void>> {
    return RequestHelper.get<ReleaseSchema>()(
      this,
      endpoint`projects/${projectId}/releases/${tagName}`,
      options,
    );
  }
}
