import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourcePushRules } from '../templates';
import type { PushRulesSchema } from '../templates/types';
import type { BaseRequestOptions, Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface GroupPushRules<C extends boolean = false> extends ResourcePushRules<C> {
  create<E extends boolean = false>(
    resourceId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<PushRulesSchema, C, E, void>>;

  edit<E extends boolean = false>(
    resourceId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<PushRulesSchema, C, E, void>>;

  remove<E extends boolean = false>(
    resourceId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>>;

  show<E extends boolean = false>(
    resourceId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<PushRulesSchema, C, E, void>>;
}

export class GroupPushRules<C extends boolean = false> extends ResourcePushRules<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('groups', options);
  }
}
