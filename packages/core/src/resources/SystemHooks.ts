import { BaseResource } from '@gitbeaker/requester-utils';
import type { HookSchema } from '../templates/types';
import { RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface SystemHookSchema extends HookSchema {}

export interface SystemHookTestResponse extends Record<string, unknown> {
  project_id: number;
  owner_email: string;
  owner_name: string;
  name: string;
  path: string;
  event_name: string;
}

export class SystemHooks<C extends boolean = false> extends BaseResource<C> {
  add<E extends boolean = false>(
    url: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<SystemHookSchema, C, E, void>> {
    return RequestHelper.post<SystemHookSchema>()(this, 'hooks', {
      url,
      ...options,
    });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<SystemHookSchema[], C, E, P>> {
    return RequestHelper.get<SystemHookSchema[]>()(this, 'hooks', options);
  }

  test<E extends boolean = false>(
    hookId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<SystemHookTestResponse, C, E, void>> {
    return RequestHelper.post<SystemHookTestResponse>()(this, `hooks/${hookId}`, options);
  }

  remove<E extends boolean = false>(
    hookId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, `hooks/${hookId}`, options);
  }
}
