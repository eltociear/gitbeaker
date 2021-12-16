import { BaseResource, BaseResourceOptions } from '@gitbeaker/requester-utils';
import {
  endpoint,
  BaseRequestOptions,
  Sudo,
  ShowExpanded,
  PaginatedRequestOptions,
  RequestHelper,
  Camelize,
  GitlabAPIResponse,
} from '../infrastructure';

export interface VariableSchema extends Record<string, unknown> {
  variable_type: 'env_var' | 'file';
  value: string;
  protected: boolean;
  masked: boolean;
  environment_scope?: string; // Environment scope is only available for projects.
  key: string;
}

export type VariabeRequestOptions = Camelize<VariableSchema>;

export class ResourceVariables<C extends boolean> extends BaseResource<C> {
  constructor(resourceType: string, options: BaseResourceOptions<C>) {
    super({ prefixUrl: resourceType, ...options });
  }

  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'keyset'>(
    resourceId: string | number,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<VariableSchema[], C, E, P>> {
    return RequestHelper.get<VariableSchema[]>()(this, endpoint`${resourceId}/variables`, options);
  }

  create<E extends boolean = false>(
    resourceId: string | number,
    options?: VariabeRequestOptions & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<VariableSchema, C, E, void>> {
    return RequestHelper.post<VariableSchema>()(this, endpoint`${resourceId}/variables`, options);
  }

  edit<E extends boolean = false>(
    resourceId: string | number,
    keyId: string,
    options?: Omit<VariabeRequestOptions, 'key'> & Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<VariableSchema, C, E, void>> {
    return RequestHelper.put<VariableSchema>()(
      this,
      endpoint`${resourceId}/variables/${keyId}`,
      options,
    );
  }

  show<E extends boolean = false>(
    resourceId: string | number,
    keyId: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<VariableSchema, C, E, void>> {
    return RequestHelper.get<VariableSchema>()(
      this,
      endpoint`${resourceId}/variables/${keyId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    resourceId: string | number,
    keyId: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, endpoint`${resourceId}/variables/${keyId}`, options);
  }
}
