import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface ManagedLicenseSchema extends Record<string, unknown> {
  id: number;
  name: string;
  approval_status: 'approved' | 'blacklisted';
}

export class ManagedLicenses<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ManagedLicenseSchema[], C, E, void>> {
    return RequestHelper.get<ManagedLicenseSchema[]>()(
      this,
      endpoint`projects/${projectId}/managed_licenses`,
      options,
    );
  }

  create<E extends boolean = false>(
    projectId: string | number,
    name: string,
    approvalStatus: 'approved' | 'blacklisted',
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ManagedLicenseSchema[], C, E, void>> {
    return RequestHelper.post<ManagedLicenseSchema[]>()(
      this,
      endpoint`projects/${projectId}/managed_licenses`,
      {
        query: {
          name,
          approvalStatus,
        },
        ...options,
      },
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    managedLicenceId: number,
    approvalStatus: 'approved' | 'blacklisted',
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ManagedLicenseSchema, C, E, void>> {
    return RequestHelper.patch<ManagedLicenseSchema>()(
      this,
      endpoint`projects/${projectId}/managed_licenses/${managedLicenceId}`,
      {
        query: {
          approvalStatus,
        },
        ...options,
      },
    );
  }

  show<E extends boolean = false>(
    projectId: string | number,
    managedLicenceId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ManagedLicenseSchema, C, E, void>> {
    return RequestHelper.get<ManagedLicenseSchema>()(
      this,
      endpoint`projects/${projectId}/managed_licenses/${managedLicenceId}`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    managedLicenceId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(
      this,
      endpoint`projects/${projectId}/managed_licenses/${managedLicenceId}`,
      options,
    );
  }
}
