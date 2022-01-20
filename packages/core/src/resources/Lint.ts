import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { BaseRequestOptions, GitlabAPIResponse } from '../infrastructure';

export interface LintSchema extends Record<string, unknown> {
  status: string;
  errors?: string[];
  warnings?: string[];
  merged_yaml?: string;
}

export interface ContextualLintSchema extends Omit<LintSchema, 'status'> {
  valid: boolean;
}

export class Lint<C extends boolean = false> extends BaseResource<C> {
  check<E extends boolean = false>(
    projectId: string | number,
    options: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ContextualLintSchema, C, E, void>> {
    return RequestHelper.get<ContextualLintSchema>()(
      this,
      endpoint`projects/${projectId}/ci/lint`,
      options,
    );
  }

  lint<E extends boolean = false>(
    content: string,
    options?: BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<LintSchema, C, E, void>>;

  lint<E extends boolean = false>(
    content: string,
    options?: { projectId: string | number } & BaseRequestOptions<E>,
  ): Promise<GitlabAPIResponse<ContextualLintSchema, C, E, void>>;

  lint<E extends boolean = false>(
    content: string,
    { projectId, ...options }: { projectId?: string | number } & BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIResponse<LintSchema | ContextualLintSchema, C, E, void>> {
    let url: string;

    if (projectId) {
      // Perform CI file linting in the context of a specific project namespace.
      // See https://docs.gitlab.com/ee/api/lint.html#validate-a-ci-yaml-configuration-with-a-namespace
      // This API is useful when the CI file being linted has `local` includes, which requires project
      // context to be understood.
      url = endpoint`projects/${projectId}/ci/lint`;
    } else {
      // Perform CI file linting without context.
      // See https://docs.gitlab.com/ee/api/lint.html#validate-the-ci-yaml-configuration
      // This API doesn't work for CI files that contain `local` includes. Use `lintWithNamespace` instead.
      url = 'ci/lint';
    }

    return RequestHelper.post<LintSchema | ContextualLintSchema>()(this, url, {
      content,
      ...options,
    });
  }
}
