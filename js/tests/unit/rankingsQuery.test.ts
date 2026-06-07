import rankingsQuery from '../../src/forum/utils/rankingsQuery';

describe('rankingsQuery', () => {
  it('puts filter, sort and include at the top level so the API honours them', () => {
    const params: any = rankingsQuery(0);

    expect(params.filter).toEqual({ rankable: true });
    expect(params.sort).toBe('-votes');
    expect(params.include).toBe('ranks');
  });

  it('only paginates under `page` (never filter/sort/include)', () => {
    const params: any = rankingsQuery(20);

    expect(params.page).toEqual({ offset: 20, limit: 10 });
    // Regression guard for #148: nesting these under `page` makes Flarum send
    // page[filter]/page[sort], which the API drops -> users fall back to id order.
    expect(params.page.filter).toBeUndefined();
    expect(params.page.sort).toBeUndefined();
    expect(params.page.include).toBeUndefined();
  });

  it('omits the offset on the initial (undefined) load', () => {
    const params: any = rankingsQuery();

    expect(params.page.offset).toBeUndefined();
    expect(params.page.limit).toBe(10);
  });
});
