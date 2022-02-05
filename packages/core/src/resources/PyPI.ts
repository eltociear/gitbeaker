import * as Mime from 'mime/lite';
import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export class PyPI<C extends boolean = false> extends BaseResource<C> {
  downloadPackageFile<E extends boolean = false>(
    sha: string,
    fileIdentifier: string,
    {
      projectId,
      groupId,
      ...options
    }:  (
      | { projectId: string | number; groupId?: never }
      | { groupId: string | number; projectId?: never }
    )  & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    let url = endpoint`packages/pypi/files/${sha}/${fileIdentifier}`;

    if (projectId) {
      url = endpoint`projects/${projectId}/${url}`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/${url}`;
    } else {
      throw new Error('Either a projectId or groupId must be passed in the options parameter');
    }

    return RequestHelper.get<Blob>()(this, url, options as ShowExpanded<E>);
  }

  showPackageDescriptor<E extends boolean = false>(
    packageName: string,
    {
      projectId,
      groupId,
      ...options
    }:  (
      | { projectId: string | number; groupId?: never }
      | { groupId: string | number; projectId?: never }
    )  & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    let url = `packages/pypi/simple/${packageName}`;

    if (projectId) {
      url = endpoint`projects/${projectId}/${url}`;
    } else if (groupId) {
      url = endpoint`groups/${groupId}/${url}`;
    } else {
      throw new Error('Either a projectId or groupId must be passed in the options parameter');
    }

    return RequestHelper.get<string>()(this, url, options as ShowExpanded<E>);
  }

  uploadPackageFile<E extends boolean = false>(
    projectId: string | number,
    content: string,
    filename: string,
    options?: ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<unknown, C, E, void>> {
    const meta = {
      filename,
      contentType: Mime.getType(filename),
    };

    return RequestHelper.put<unknown>()(
      this,
      endpoint`projects/${projectId}/packages/pypi`,
      {
        isForm: true,
        ...options,
        file: [content, meta],
      },
    );
  }
}
