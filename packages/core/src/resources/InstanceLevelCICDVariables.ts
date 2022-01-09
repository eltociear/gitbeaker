import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface CICDVariable extends Record<string, unknown> {
  key: string;
  variable_type: string;
  value: string;
  protected: boolean;
  masked: boolean;
}

export class InstanceLevelCICDVariables<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<CICDVariable[], C, E, void>> {
    return RequestHelper.get<CICDVariable[]>()(this, 'admin/ci/variables', options);
  }

  create<E extends boolean = false>(
    key: string,
    value: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<CICDVariable, C, E, void>> {
    return RequestHelper.post<CICDVariable>()(this, 'admin/ci/variables', {
      key,
      value,
      ...options,
    });
  }

  edit<E extends boolean = false>(
    keyId: string,
    value: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<CICDVariable, C, E, void>> {
    return RequestHelper.put<CICDVariable>()(this, endpoint`admin/ci/variables/${keyId}`, {
      value,
      ...options,
    });
  }

  show<E extends boolean = false>(
    keyId: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<CICDVariable, C, E, void>> {
    return RequestHelper.get<CICDVariable>()(this, endpoint`admin/ci/variables/${keyId}`, options);
  }

  remove<E extends boolean = false>(
    keyId: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.get<void>()(this, endpoint`admin/ci/variables/${keyId}`, options);
  }
}
