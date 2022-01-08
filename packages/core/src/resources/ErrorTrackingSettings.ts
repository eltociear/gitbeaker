import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface ErrorTrackingSettingsSchema extends Record<string, unknown> {
  active: boolean;
  project_name: string;
  sentry_external_url: string;
  api_url: string;
  integrated: boolean;
}

export class ApplicationSettings<C extends boolean = false> extends BaseResource<C> {
  show<E extends boolean = false>(
    projectId: string | number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ErrorTrackingSettingsSchema, C, E, void>> {
    return RequestHelper.get<ErrorTrackingSettingsSchema>()(
      this,
      endpoint`projects/${projectId}/error_tracking/settings`,
      options,
    );
  }

  edit<E extends boolean = false>(
    projectId: string | number,
    active: boolean,
    { integrated, ...options }: BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIResponse<ErrorTrackingSettingsSchema, C, E, void>> {
    return RequestHelper.patch<ErrorTrackingSettingsSchema>()(
      this,
      endpoint`projects/${projectId}/error_tracking/settings`,
      {
        query: {
          active,
          integrated,
        },
        ...options,
      },
    );
  }
}
