const config = require('@flarum/jest-config')();

module.exports = {
  ...config,
  moduleNameMapper: {
    ...config.moduleNameMapper,
    // Resolve Flarum core's frontend source from the installed Composer package.
    '^@flarum/core/(.*)$': '<rootDir>/../vendor/flarum/core/js/$1',
  },
  // @flarum/jest-config ships untranspiled .ts (e.g. test-matchers.ts); transform it.
  transformIgnorePatterns: ['node_modules/(?!@flarum/)'],
  // Let Flarum core's frontend source (resolved from ../vendor, outside our tree)
  // find its bare dependencies in this package's node_modules.
  modulePaths: ['<rootDir>/node_modules'],
};
