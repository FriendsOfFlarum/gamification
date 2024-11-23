import app from 'flarum/admin/app';

export { default as extend } from './extend';

app.initializers.add('fof-gamification', (app) => {
  //
});

export * from '../common/helpers';
export * from './components';
