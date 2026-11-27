import bootstrapForum from '@flarum/jest-config/src/bootstrap/forum';
import app from 'flarum/forum/app';
import extend from '../../../src/common/extend';

beforeAll(() => {
  bootstrapForum();
  app.bootExtensions({ 'fof-gamification': { extend } });
  app.boot();
  app.translator.addTranslations({
    'core.lib.gambits.group_keys.is': 'статус',
    'fof-gamification.lib.gambits.trending.key': 'обсуждаемая',
  });
});

it('turns the translated gambit into the trending filter', () => {
  expect(app.search.gambits.apply('discussions', { q: 'статус:обсуждаемая' })).toStrictEqual({ q: '', trending: true });
});

it('still turns the English is:trending into the trending filter on a translated forum', () => {
  expect(app.search.gambits.apply('discussions', { q: 'is:trending' })).toStrictEqual({ q: '', trending: true });
});

it('still turns the negated English -is:trending into the negated filter on a translated forum', () => {
  expect(app.search.gambits.apply('discussions', { q: '-is:trending' })).toStrictEqual({ q: '', '-trending': true });
});
