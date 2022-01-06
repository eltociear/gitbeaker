import type { BaseResourceOptions } from '@gitbeaker/requester-utils';
import { ResourceTemplates } from '../templates';
import type { PaginatedRequestOptions, Sudo, GitlabAPIResponse } from '../infrastructure';

export interface LicenseTemplateSchema extends Record<string, unknown> {
  key: string;
  name: string;
  nickname?: string;
  featured: boolean;
  html_url: string;
  source_url: string;
  description: string;
  conditions?: string[];
  permissions?: string[];
  limitations?: string[];
  content: string;
}

export interface LicenseTemplates<C extends boolean = false> extends ResourceTemplates<C> {
  all<E extends boolean = false, P extends 'keyset' | 'offset' = 'offset'>(
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<LicenseTemplateSchema[], C, E, P>>;

  show<E extends boolean = false>(
    key: string | number,
    options?: Sudo,
  ): Promise<GitlabAPIResponse<LicenseTemplateSchema, C, E, void>>;
}

export class LicenseTemplates<C extends boolean = false> extends ResourceTemplates<C> {
  constructor(options: BaseResourceOptions<C>) {
    /* istanbul ignore next */
    super('Licenses', options);
  }
}
