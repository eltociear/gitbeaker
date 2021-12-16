import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import {
  endpoint,
  BaseRequestOptions,
  PaginatedRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface LabelSchema extends Record<string, unknown> {
  id: number;
  name: string;
  color: string;
  text_color: string;
  description: string;
  description_html: string;
  open_issues_count: number;
  closed_issues_count: number;
  open_merge_requests_count: number;
  subscribed: boolean;
  priority: number;
  is_project_label: boolean;
}

export class ResourceLabels<C extends boolean = false> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    resourceId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<LabelSchema[], C, E, P>> {
    return RequestHelper.get<LabelSchema[]>()(this, endpoint`${resourceId}/labels`, options);
  }

  create<E extends boolean = false>(
    resourceId: string | number,
    labelName: string,
    color: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>> {
    return RequestHelper.post<LabelSchema>()(this, endpoint`${resourceId}/labels`, {
      name: labelName,
      color,
      ...options,
    });
  }

  edit<E extends boolean = false>(
    resourceId: string | number,
    labelId: number | string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>> {
    return RequestHelper.put<LabelSchema>()(
      this,
      endpoint`${resourceId}/labels/${labelId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    resourceId: string | number,
    labelId: number | string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`${resourceId}/labels/${labelId}`, options);
  }

  subscribe<E extends boolean = false>(
    resourceId: string | number,
    labelId: number | string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>> {
    return RequestHelper.post<LabelSchema>()(
      this,
      endpoint`${resourceId}/issues/${labelId}/subscribe`,
      options,
    );
  }

  unsubscribe<E extends boolean = false>(
    resourceId: string | number,
    labelId: number | string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<LabelSchema, C, E, void>> {
    return RequestHelper.post<LabelSchema>()(
      this,
      endpoint`${resourceId}/issues/${labelId}/unsubscribe`,
      options,
    );
  }
}
