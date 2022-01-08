import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface FeatureFlagUserListSchema extends Record<string, unknown> {
  name: string;
  user_xids: string;
  id: number;
  iid: number;
  project_id: string | number;
  created_at: string;
  updated_at: string;
}

export class FeatureFlags<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    projectId: string | number,
    options: { scopes?: 'enabled' | 'disabled' } & PaginatedRequestOptions<E, P> = {} as any,
  ): Promise<GitlabAPIResponse<FeatureFlagUserListSchema[], C, E, P>> {
    return RequestHelper.get<FeatureFlagUserListSchema[]>()(
      this,
      endpoint`projects/${projectId}/feature_flags_user_lists`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    name: string,
    userXIds: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<FeatureFlagUserListSchema, C, E, void>> {
    return RequestHelper.post<FeatureFlagUserListSchema>()(
      this,
      endpoint`projects/${projectId}/feature_flags_user_lists`,
      {
        name,
        userXIds,
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    featureFlagUserListIId: string,
    options?: { name?: string; userXIds?: string } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<FeatureFlagUserListSchema, C, E, void>> {
    return RequestHelper.put<FeatureFlagUserListSchema>()(
      this,
      endpoint`projects/${projectId}/feature_flags_user_lists/${featureFlagUserListIId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    featureFlagUserListIId: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/feature_flags_user_lists/${featureFlagUserListIId}`,
      options,
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    featureFlagUserListIId: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<FeatureFlagUserListSchema, C, E, void>> {
    return RequestHelper.get<FeatureFlagUserListSchema>()(
      this,
      endpoint`projects/${projectId}/feature_flags_user_lists/${featureFlagUserListIId}`,
      options,
    );
  }
}
