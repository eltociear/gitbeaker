import { BaseResource } from '@gitbeaker/requester-utils';
import { RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface ApplicationAppearenceSchema extends Record<string, unknown> {
  title: string;
  description: string;
  logo: string;
  header_logo: string;
  favicon: string;
  new_project_guidelines: string;
  profile_image_guidelines: string;
  header_message: string;
  footer_message: string;
  message_background_color: string;
  message_font_color: string;
  email_header_and_footer_enabled: boolean;
}

export class ApplicationSettings<C extends boolean = false> extends BaseResource<C> {
  show<E extends boolean = false>(
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<ApplicationAppearenceSchema, C, E, void>> {
    return RequestHelper.get<ApplicationAppearenceSchema>()(
      this,
      'application/appearence',
      options,
    );
  }

  edit<E extends boolean = false>(
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ApplicationAppearenceSchema, C, E, void>> {
    return RequestHelper.put<ApplicationAppearenceSchema>()(
      this,
      'application/appearence',
      options,
    );
  }
}
