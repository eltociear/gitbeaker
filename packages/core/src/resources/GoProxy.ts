import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, GitlabAPIResponse } from '../infrastructure';

export interface GoProxyModuleVersionSchema extends Record<string, unknown> {
  Version: string;
  Time: string;
}

export class GeoNodes<C extends boolean = false> extends BaseResource<C> {
  all<E extends boolean = false>(
    projectId: string | number,
    moduleName: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    return RequestHelper.get<string>()(
      this,
      endpoint`projects/${projectId}/packages/go/${moduleName}/@v/list`,
      options,
    );
  }

  versionMetadata<E extends boolean = false>(
    projectId: string | number,
    moduleName: string,
    moduleVersion: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<GoProxyModuleVersionSchema, C, E, void>> {
    return RequestHelper.get<GoProxyModuleVersionSchema>()(
      this,
      endpoint`projects/${projectId}/packages/go/${moduleName}/@v/${moduleVersion}.info`,
      options,
    );
  }

  downloadModuleFile<E extends boolean = false>(
    projectId: string | number,
    moduleName: string,
    moduleVersion: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<string, C, E, void>> {
    return RequestHelper.get<string>()(
      this,
      endpoint`projects/${projectId}/packages/go/${moduleName}/@v/${moduleVersion}.mod`,
      options,
    );
  }

  downloadModuleSource<E extends boolean = false>(
    projectId: string | number,
    moduleName: string,
    moduleVersion: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    return RequestHelper.get<Blob>()(
      this,
      endpoint`projects/${projectId}/packages/go/${moduleName}/@v/${moduleVersion}.zip`,
      options,
    );
  }
}
