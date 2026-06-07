import type { ApiQueryParamsPlural } from 'flarum/common/Store';

/**
 * Builds the API query for the rankings page: rankable users sorted by their
 * vote total (descending), paginated 10 at a time.
 *
 * `filter`, `include` and `sort` must live at the top level of the query —
 * Flarum's store nests anything under `page` as `page[...]`, which the API
 * ignores, causing the server to fall back to its default (by id) ordering.
 */
export default function rankingsQuery(offset?: number): ApiQueryParamsPlural {
  return {
    filter: {
      rankable: true,
    },
    include: 'ranks',
    sort: '-votes',
    page: {
      offset,
      limit: 10,
    },
  };
}
