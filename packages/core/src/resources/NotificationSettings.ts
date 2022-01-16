import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export type NotificationSettingLevel =
  | 'disabled'
  | 'participating'
  | 'watch'
  | 'global'
  | 'mention'
  | 'custom';

export type CustomSettingLevelEmailEvents =
  | 'new_note'
  | 'new_issue'
  | 'reopen_issue'
  | 'close_issue'
  | 'reassign_issue'
  | 'issue_due'
  | 'new_merge_request'
  | 'push_to_merge_request'
  | 'reopen_merge_request'
  | 'close_merge_request'
  | 'reassign_merge_request'
  | 'merge_merge_request'
  | 'failed_pipeline'
  | 'fixed_pipeline'
  | 'success_pipeline'
  | 'moved_project'
  | 'merge_when_pipeline_succeeds'
  | 'new_epic ';

export interface NotificationSettingSchema extends Record<string, unknown> {
  level: NotificationSettingLevel;
  notification_email: string;
}

const url = ({
  projectId,
  groupId,
}: {
  projectId?: string | number;
  groupId?: string | number;
}) => {
  let prefix = '';

  if (projectId) {
    prefix = endpoint`projects/${projectId}/`;
  } else if (groupId) {
    prefix = endpoint`groups/${groupId}/`;
  }

  return `${prefix}notification_settings`;
};

export class NotificationSettings<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    options: (
      | { projectId?: string | number; groupId?: never }
      | { groupId?: string | number; projectId?: never }
    ) &
      Sudo &
      ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<NotificationSettingSchema[], C, E, void>> {
    const uri = url(options);

    return RequestHelper.get<NotificationSettingSchema[]>()(this, uri, options);
  }

  edit<E extends boolean = false>(
    options: (
      | { projectId?: string | number; groupId?: never }
      | { groupId?: string | number; projectId?: never }
    ) &
      BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<NotificationSettingSchema, C, E, void>> {
    const uri = url(options);

    return RequestHelper.put<NotificationSettingSchema>()(this, uri, options);
  }
}
