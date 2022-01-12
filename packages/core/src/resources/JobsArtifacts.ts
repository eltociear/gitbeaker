import { BaseResource } from '@gitbeaker/requester-utils';
import { endpoint, RequestHelper } from '../infrastructure';
import type { Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';
import type { JobSchema } from './Jobs';

export class JobArtifacts<C extends boolean = false> extends BaseResource<C> {
  download<E extends boolean = false>(
    projectId: string | number,
    {
      jobId,
      jobToken,
      artifactPath,
      ref,
      job,
      ...options
    }: (
      | { jobId?: number; ref?: never; job?: never; artifactPath?: never }
      | { jobId: number; artifactPath: string; ref: never; job: never }
      | { artifactPath: string; ref: string; job: string; jobId: never }
    ) & { jobToken?: string } & Sudo &
      ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    if (!this.headers['job-token'] && !jobToken)
      throw new Error('Missing required header "job-token" or jobToken argument');

    let url: string;

    if (artifactPath && ref && job) {
      url = endpoint`projects/${projectId}/jobs/artifacts/${ref}/raw/${artifactPath}?job=${job}`;
    } else if (artifactPath && jobId) {
      url = endpoint`projects/${projectId}/jobs/${jobId}/artifacts/${artifactPath}`;
    } else if (jobId) {
      url = endpoint`projects/${projectId}/jobs/${jobId}/artifacts`;
    } else {
      throw new Error('Missing one of the required parameters. See typing');
    }

    return RequestHelper.get<Blob>()(this, url, {
      query: {
        jobToken,
      },
      ...options,
    });
  }

  downloadArchive<E extends boolean = false>(
    projectId: string | number,
    ref: string,
    job: string,
    { jobToken, ...options }: { jobToken?: string } & Sudo & ShowExpanded<E> = {},
  ): Promise<GitlabAPIResponse<Blob, C, E, void>> {
    if (!this.headers['job-token'] && !jobToken)
      throw new Error('Missing required header "job-token" or jobToken argument');

    const url = endpoint`projects/${projectId}/jobs/artifacts/${ref}/download`;

    return RequestHelper.get<Blob>()(this, url, {
      query: {
        jobToken,
        job,
      },
      ...options,
    });
  }

  keep<E extends boolean = false>(
    projectId: string | number,
    jobId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<JobSchema, C, E, void>> {
    return RequestHelper.post<JobSchema>()(
      this,
      endpoint`projects/${projectId}/jobs/${jobId}/artifacts/keep`,
      options,
    );
  }

  remove<E extends boolean = false>(
    projectId: string | number,
    jobId: number,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<void, C, E, void>> {
    return RequestHelper.del()(this, `projects/${projectId}/jobs/${jobId}/artifacts`, options);
  }
}
