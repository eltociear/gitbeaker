import { parse as parseLink } from 'li';
import { parseUrl as parseQueryString } from 'query-string';
import { camelizeKeys } from 'xcase';
import { BaseResource } from '@gitbeaker/requester-utils';
import { appendFormFromObject, Camelize } from './Utils';

// Request Options
export type IsForm = {
  isForm?: boolean;
};

export type Sudo = {
  sudo?: string | number;
};

export type ShowExpanded<E extends boolean = false> = {
  showExpanded?: E;
};

export type BaseRequestOptions<E extends boolean = false> = Record<string, unknown> &
  Sudo &
  ShowExpanded<E>;

export type BasePaginationRequestOptions<
  E extends boolean = false,
  P extends 'keyset' | 'offset' | void = 'keyset',
> = BaseRequestOptions<E> & {
  pagination?: P;
  perPage?: number;
};

export type OffsetPaginationRequestOptions = {
  page?: number;
  maxPages?: number;
};

export type PaginatedRequestOptions<
  E extends boolean,
  P extends 'keyset' | 'offset' | void = 'keyset',
> = P extends 'keyset'
  ? BasePaginationRequestOptions<E, P>
  : BasePaginationRequestOptions<E, P> & OffsetPaginationRequestOptions;

// Response Formats
export interface ExpandedResponse<T = Record<string, unknown>> {
  data: T;
  headers: Record<string, unknown>;
  status: number;
}

export interface PaginationResponse<T = Record<string, unknown>[]> {
  data: T;
  paginationInfo: {
    total: number;
    next: number | null;
    current: number;
    previous: number | null;
    perPage: number;
    totalPages: number;
  };
}

export type CamelizedResponse<T, C> = C extends true ? Camelize<T> : T;

export type GitlabAPIRecordResponse<
  T extends Record<string, unknown> | void,
  C extends boolean,
  E extends boolean,
> = T extends void
  ? void
  : E extends true
  ? ExpandedResponse<CamelizedResponse<T, C>>
  : CamelizedResponse<T, C>;

export type GitlabAPIArrayResponse<
  T,
  C extends boolean,
  E extends boolean,
  P extends 'keyset' | 'offset' | void,
> = E extends true
  ? P extends 'keyset'
    ? CamelizedResponse<T, C>[]
    : PaginationResponse<CamelizedResponse<T, C>[]>
  : CamelizedResponse<T, C>[];

export type GitlabAPIResponse<
  T extends Record<string, unknown> | Record<string, unknown>[] | void,
  C extends boolean,
  E extends boolean,
  P extends 'keyset' | 'offset' | void,
> = T extends Record<string, unknown>
  ? GitlabAPIRecordResponse<T, C, E>
  : T extends (infer R)[]
  ? GitlabAPIArrayResponse<R, C, E, P>
  : void;

async function getHelper<
  E extends boolean = false,
  P extends 'keyset' | 'offset' | void = 'keyset',
>(
  service: BaseResource<boolean>,
  endpoint: string,
  options: PaginatedRequestOptions<E, P> & { maxPages?: number },
  acc: Record<string, unknown>[] = [],
): Promise<any> {
  const { sudo, showExpanded, maxPages, ...query } = options || {};
  const response = await service.requester.get(endpoint, { query, sudo });
  const { headers, status } = response;
  let { body } = response;

  // Camelize response body if specified
  if (service.camelize) body = camelizeKeys(body);

  // Handle object responses
  if (!Array.isArray(body)) {
    if (!showExpanded) return body;

    return {
      data: body,
      headers,
      status,
    };
  }

  // Handle array responses
  const newAcc = [...acc, ...body];
  const { next }: { next: string } = parseLink(headers.link);
  const { query: qs = {} } = next ? parseQueryString(next, { parseNumbers: true }) : {};
  const withinBounds = maxPages
    ? newAcc.length / ((qs.per_page as unknown as number) || 20) < maxPages
    : true;

  // Recurse through pagination results
  if (!(query.page && acc.length === 0) && next && withinBounds) {
    return getHelper(
      service,
      endpoint,
      {
        ...qs,
        maxPages,
        sudo,
      },
      newAcc,
    );
  }

  if (!showExpanded || query.pagination === 'keyset') return newAcc;

  return {
    data: newAcc,
    paginationInfo: {
      total: parseInt(headers['x-total'], 10),
      next: parseInt(headers['x-next-page'], 10) || null,
      current: parseInt(headers['x-page'], 10) || 1,
      previous: parseInt(headers['x-prev-page'], 10) || null,
      perPage: parseInt(headers['x-per-page'], 10),
      totalPages: parseInt(headers['x-total-pages'], 10),
    },
  };
}

export function get<
  T extends Record<string, unknown> | Record<string, unknown>[] = Record<string, unknown>,
>() {
  return <
    C extends boolean,
    E extends boolean = false,
    P extends 'keyset' | 'offset' | void = void,
  >(
    service: BaseResource<C>,
    endpoint: string,
    options?: PaginatedRequestOptions<E, P>,
  ): Promise<GitlabAPIResponse<T, C, E, P>> => getHelper<E, P>(service, endpoint, options as any);
}

export function post<T extends Record<string, unknown> | void = Record<string, unknown>>() {
  return async <C extends boolean, E extends boolean = false>(
    service: BaseResource<C>,
    endpoint: string,
    { query, isForm, sudo, showExpanded, ...options }: IsForm & BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIRecordResponse<T, C, E>> => {
    const body = isForm ? appendFormFromObject(options) : options;

    const r = await service.requester.post(endpoint, {
      query,
      body,
      sudo,
    });

    return showExpanded
      ? {
          data: r.body,
          status: r.status,
          headers: r.headers,
        }
      : r.body;
  };
}

export function put<T extends Record<string, unknown> = Record<string, unknown>>() {
  return async <C extends boolean, E extends boolean = false>(
    service: BaseResource<C>,
    endpoint: string,
    { query, isForm, sudo, showExpanded, ...options }: IsForm & BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIRecordResponse<T, C, E>> => {
    const body = isForm ? appendFormFromObject(options) : options;

    const r = await service.requester.put(endpoint, {
      body,
      query,
      sudo,
    });

    return showExpanded
      ? {
          data: r.body,
          status: r.status,
          headers: r.headers,
        }
      : r.body;
  };
}

export function del<T extends Record<string, unknown> | void = void>() {
  return async <C extends boolean, E extends boolean = false>(
    service: BaseResource<C>,
    endpoint: string,
    { sudo, showExpanded, ...query }: BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIRecordResponse<T, C, E>> => {
    const r = await service.requester.delete(endpoint, {
      query,
      sudo,
    });

    return showExpanded
      ? {
          data: r.body,
          status: r.status,
          headers: r.headers,
        }
      : r.body;
  };
}

function stream<C extends boolean>(
  service: BaseResource<C>,
  endpoint: string,
  options?: BaseRequestOptions,
): NodeJS.ReadableStream {
  if (typeof service.requester.stream !== 'function') {
    throw new Error('Stream method is not implementated in requester!');
  }

  return service.requester.stream(endpoint, {
    query: options,
  });
}

export const RequestHelper = {
  post,
  put,
  get,
  del,
  stream,
};
