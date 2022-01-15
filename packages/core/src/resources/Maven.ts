import * as Mime from 'mime/lite';
import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export class Maven<C extends boolean = false> extends BaseResource<C> {
  downloadPackageFile<E extends boolean = false>(
    path: string,
    filename: string,
    {
      projectId,
      groupId,
      ...options
    }: { projectId: string | number; groupId: string | number } & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    let url = endpoint`packages/maven/${path}/${filename}`;

    if (projectId) {
      url = endpoint`projects/${projectId}/${url}`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/-/${url}`;
    }

    return RequestHelper.get<Blob>()(this, url, options as ShowExpanded<E>);
  }

  uploadPackageFile<E extends boolean = false>(
    projectId: string | number,
    content: string,
    path: string,
    filename: string,
    options?: ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    const meta = {
      filename,
      contentType: Mime.getType(filename),
    };

    return RequestHelper.put<unknown>()(
      this,
      endpoint`projects/${projectId}/packages/maven/${path}/${filename}`,
      {
        isForm: true,
        ...options,
        file: [content, meta],
      },
    );
  }
}
