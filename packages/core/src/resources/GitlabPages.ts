import { BaseResource } from '@gitbeaker/requester-utils';
import { Sudo, ShowExpanded, RequestHelper, GitlabAPIResponse } from '../infrastructure';

export class GitlabPages<C extends boolean = false> extends BaseResource<C> {
  remove<E extends boolean = false>(
    projectId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, `projects/${projectId}/pages`, options);
  }
}
