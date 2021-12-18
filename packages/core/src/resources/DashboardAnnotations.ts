import { BaseResource } from '@gitbeaker/requester-utils';
import { RequestHelper, Sudo, ShowExpanded, GitlabAPIResponse } from '../infrastructure';

export interface DashboardAnnotationSchema extends Record<string, unknown> {
  id: number;
  starting_at: string;
  ending_at?: null;
  dashboard_path: string;
  description: string;
  environment_id: number;
  cluster_id?: null;
}

export class DashboardAnnotations<C extends boolean = false> extends BaseResource<C> {
  create<E extends boolean = false>(
    environmentId: number,
    dashboardPath: string,
    startingAt: string,
    description: string,
    options?: Sudo & ShowExpanded<E>,
  ): Promise<GitlabAPIResponse<DashboardAnnotationSchema, C, E, void>> {
    return RequestHelper.post<DashboardAnnotationSchema>()(
      this,
      `environments/${environmentId}/metrics_dashboard/annotations`,
      {
        dashboardPath,
        startingAt,
        description,
        ...options,
      },
    );
  }
}
