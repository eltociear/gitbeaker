import { BaseResource } from '@gitbeaker/requester-utils';
import * as Mime from 'mime/lite';
import {
  endpoint,
  BaseRequestOptions,
  RequestHelper,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
} from '../infrastructure';

export interface GroupRelationExportStatusSchema extends Record<string, unknown> {
  relation: string;
  status: number;
  error?: string;
  updated_at: string;
}

export class GroupRelationExports<C extends boolean = false> extends BaseResource<C> {
  download<E extends boolean = false>(
    groupId: string | number,
    relation: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(this, endpoint`groups/${groupId}/export_relations/download`, {
      query: { relation },
      ...options,
    });
  }

  exportStatus<E extends boolean = false>(
    groupId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<GroupRelationExportStatusSchema[], C, E, void>> {
    return RequestHelper.get<GroupRelationExportStatusSchema[]>()(
      this,
      endpoint`groups/${groupId}/export_relations`,
      options,
    );
  }

  scheduleExport<E extends boolean = false>(
    groupId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<{ message: string }, C, E, void>> {
    return RequestHelper.post<{ message: string }>()(
      this,
      endpoint`groups/${groupId}/export_relations`,
      options,
    );
  }
}
