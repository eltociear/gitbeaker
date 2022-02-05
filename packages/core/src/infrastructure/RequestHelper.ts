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
export type CamelizedResponse<T, C> = C extends true ? Camelize<T> : T;

export interface OffsetPagination {
  total: number;
  next: number | null;
  current: number;
  previous: number | null;
  perPage: number;
  totalPages: number;
}

export interface KeysetPagination {
  idAfter?: number;
  cursor?: string;
}

export interface ExpandedResponse<T> {
  data: T;
  headers: Record<string, unknown>;
  status: number;
}

export interface PaginatedResponse<T, I> {
  data: T;
  paginationInfo: I;
}

export type GitlabAPIExpandedResponse<T, E extends boolean, P> = E extends true
  ? P extends 'keyset'
    ? PaginatedResponse<T, KeysetPagination>
    : P extends 'offset'
    ? PaginatedResponse<T, OffsetPagination>
    : ExpandedResponse<T>
  : T;

export type GitlabAPISingleResponse<T, C extends boolean | void, E extends boolean> = T extends Record<
  string,
  unknown
>
  ? GitlabAPIExpandedResponse<CamelizedResponse<T, C>, E, void>
  : GitlabAPIExpandedResponse<T, E, void>;

export type GitlabAPIMultiResponse<
  T,
  C extends boolean | void,
  E extends boolean,
  P extends 'keyset' | 'offset' | void,
> = T extends Record<string, unknown>
  ? GitlabAPIExpandedResponse<CamelizedResponse<T, C>[], E, P>
  : GitlabAPIExpandedResponse<T[], E, P>;

export type GitlabAPIResponse<
  T,
  C extends boolean | void,
  E extends boolean,
  P extends 'keyset' | 'offset' | void,
> = T extends (infer R)[] ? GitlabAPIMultiResponse<R, C, E, P> : GitlabAPISingleResponse<T, C, E>;

async function getHelper<E extends boolean = false, P extends 'keyset' | 'offset' | void = void>(
  service: BaseResource<boolean>,
  endpoint: string,
  options: PaginatedRequestOptions<E, P> & { maxPages?: number },
  acc: Record<string, unknown>[] = [],
): Promise<any> {
  const { sudo, showExpanded, maxPages, ...query } = options || {};
  const response = await service.requester.get(endpoint, { query, sudo });
  const { headers, status } = response;
  let { body } = response;

  if (!Array.isArray(body)) {
    if (Object.keys(body).length > 0) {
      if (service.camelize) body = camelizeKeys(body);
    }

    if (!showExpanded) return body;

    return {
      data: body,
      headers,
      status,
    };
  }
  // Camelize response body if specified
  if (service.camelize) body = camelizeKeys(body);

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

  if (!showExpanded) return newAcc;

  if (query.pagination !== 'keyset') {
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

  return {
    data: newAcc,
    paginationInfo: {
      idAfter: qs['id_after'] && parseInt(qs['id_after'] as string, 10),
      cursor: qs.cursor,
      perPage: qs['per_page'] && parseInt(qs['per_page'] as string, 10),
      orderBy: qs['order_by'],
      sort: qs['sort'],
    },
  };
}

export function get<T>() {
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

export function post<T>() {
  return async <C extends boolean, E extends boolean = false>(
    service: BaseResource<C>,
    endpoint: string,
    { query, isForm, sudo, showExpanded, ...options }: IsForm & BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIResponse<T, C, E, void>> => {
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

export function put<T>() {
  return async <C extends boolean, E extends boolean = false>(
    service: BaseResource<C>,
    endpoint: string,
    { query, isForm, sudo, showExpanded, ...options }: IsForm & BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIResponse<T, C, E, void>> => {
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

export function patch<T>() {
  return async <C extends boolean, E extends boolean = false>(
    service: BaseResource<C>,
    endpoint: string,
    { query, isForm, sudo, showExpanded, ...options }: IsForm & BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIResponse<T, C, E, void>> => {
    const body = isForm ? appendFormFromObject(options) : options;

    const r = await service.requester.patch(endpoint, {
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

export function del<T = void>() {
  return async <C extends boolean, E extends boolean = false>(
    service: BaseResource<C>,
    endpoint: string,
    { sudo, showExpanded, ...query }: BaseRequestOptions<E> = {},
  ): Promise<GitlabAPIResponse<T, C, E, void>> => {
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
  patch,
  get,
  del,
  stream,
};
