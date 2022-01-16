import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  PaginatedRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface AuditEventSchema extends Record<string, unknown> {
  id: number;
  author_id: number;
  entity_id: number;
  entity_type: string;
  details: {
    custom_message: string;
    author_name: string;
    target_id: string;
    target_type: string;
    target_details: string;
    ip_address: string;
    entity_path: string;
  };
  created_at: string;
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

  return `${prefix}audit_events`;
};

export class AuditEvents<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    options: (
      | { projectId?: string | number; groupId?: never }
      | { groupId?: string | number; projectId?: never }
    ) &
      PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<AuditEventSchema[], C, E, P>> {
    const uri = url(options);

    return RequestHelper.get<AuditEventSchema[]>()(this, uri, options);
  }

  show<E extends boolean = false>(
    auditEventId: number,
    options: (
      | { projectId?: string | number; groupId?: never }
      | { groupId?: string | number; projectId?: never }
    ) &
      Sudo &
      ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<AuditEventSchema, C, E, void>> {
    const uri = url(options);

    return RequestHelper.get<AuditEventSchema>()(this, `${uri}/${auditEventId}`, options);
  }
}
