import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceProtectedEnvironments } from '../templates';
import { ProtectedEnviromentSchema, ProtectedEnvironmentAccessLevel } from '../templates/types';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface GroupProtectedEnvironments<C extends boolean = false> {
    all<E extends boolean = false>(
      groupId: string | number,
      options: { search?: string } & Sudo & ShowExpanded<E>,
    ): Promise<GitlabAPIResponse<ProtectedEnviromentSchema[], C, E, void>>

    protect<E extends boolean = false>(
      groupId: string | number,
      name: string,
      deployAccessLevel: ProtectedEnvironmentAccessLevel[],
      options?: { requiredApprovalCount?: number } & Sudo & ShowExpanded<E>,
    ): Promise<GitlabAPIResponse<ProtectedEnviromentSchema, C, E, void>>

    show<E extends boolean = false>(
      groupId: string | number,
      name: string,
      options?: Sudo & ShowExpanded<E>,
    ): Promise<GitlabAPIResponse<ProtectedEnviromentSchema, C, E, void>>

    unprotect<E extends boolean = false>(
      groupId: string | number,
      name: string,
      options?: Sudo & ShowExpanded<E>,
    ): Promise<GitlabAPIResponse<void, C, E, void>>
}

export class GroupProtectedEnvironments<C extends boolean = false> extends ResourceProtectedEnvironments<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('groups', options);
  }
}
