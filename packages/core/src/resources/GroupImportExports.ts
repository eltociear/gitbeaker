import * as Mime from 'mime/lite';
import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type {
  BaseRequestOptions,
  Sudo,
  ShowExpanded,
  GitlabAPIResponse,
  UploadMetadataOptions,
} from '../infrastructure';

export class GroupImportExports<C extends boolean = false> extends BaseResource<C> {
  download<E extends boolean = false>(
    groupId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(this, endpoint`groups/${groupId}/export/download`, options);
  }

  // TODO: What does this return?
  import<E extends boolean = false>(
    content: string,
    name: string,
    path: string,
    {
      metadata,
      parentId,
      ...options
    }: { parentId?: number; metadata?: UploadMetadataOptions } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    const meta = {
      filename: `${Date.now().toString()}.tar.gz`,
      ...metadata,
    };

    if (!meta.contentType) meta.contentType = Mime.getType(meta.filename) || undefined;

    return RequestHelper.post<unknown>()(this, 'groups/import', {
      isForm: true,
      ...options,
      file: [content, meta],
      path,
      name,
      parentId,
    });
  }

  scheduleExport<E extends boolean = false>(
    groupId: string | number,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<{ message: string }, C, E, void>> {
    return RequestHelper.post<{ message: string }>()(
      this,
      endpoint`groups/${groupId}/export`,
      options,
    );
  }
}
