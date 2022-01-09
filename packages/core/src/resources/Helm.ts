import * as Mime from 'mime/lite';
import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';
import type { UploadMetadata } from './types';

export const defaultMetadata = {
  filename: `${Date.now().toString()}.tgz`,
};

export class Helm<C extends boolean = false> extends BaseResource<C> {
  downloadChartIndex<E extends boolean = false>(
    projectId: string | number,
    channel: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(
      this,
      endpoint`projects/${projectId}/packages/helm/${channel}/index.yaml`,
      options,
    );
  }

  downloadChart<E extends boolean = false>(
    projectId: string | number,
    channel: string,
    filename: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(
      this,
      endpoint`projects/${projectId}/packages/helm/${channel}/charts/${filename}.tgz`,
      options,
    );
  }

  import<E extends boolean = false>(
    projectId: string | number,
    content: string,
    channel: string,
    {
      metadata,
      parentId,
      ...options
    }: { parentId?: number; metadata?: UploadMetadata } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    const meta = { ...defaultMetadata, ...metadata };

    if (!meta.contentType) meta.contentType = Mime.getType(meta.filename) || undefined;

    return RequestHelper.post<void>()(
      this,
      endpoint`projects/${projectId}/packages/helm/api/${channel}/charts`,
      {
        isForm: true,
        ...options,
        file: [content, meta],
      },
    );
  }
}
