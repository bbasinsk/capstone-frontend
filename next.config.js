/* eslint-disable global-require */
const { IgnorePlugin } = require('webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const OfflinePlugin = require('offline-plugin');
const Dotenv = require('dotenv-webpack');
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const path = require('path');
const fs = require('fs');
const router = require('./routes');

const initExport = {
  webpack: (config, { dev, isServer }) => {
    const prod = !dev;

    config.plugins.push(new Dotenv({ path: './public.env' }));
    config.plugins.push(new IgnorePlugin(/^\.\/locale$/, /moment$/));

    if (dev) {
      config.module.rules.push({
        test: /\.(jsx?|gql|graphql)$/,
        loader: 'eslint-loader',
        exclude: ['/node_modules/', '/.next/', '/helper_scripts/'],
        enforce: 'pre'
      });
    }

    if (process.env.ANALYZE_BUILD) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true
        })
      );
    }

    if (prod && process.env.OFFLINE_SUPPORT) {
      config.plugins.push(
        new OfflinePlugin({
          publicPath: '/',
          relativePaths: false,
          externals: ['/', '/manifest.html'],
          excludes: ['.htaccess'],
          safeToUseOptionalCaches: true,
          caches: 'all',
          rewrites: function rewrites(asset) {
            if (
              asset.indexOf('.hot-update.js') > -1 ||
              asset.indexOf('build-stats.json') > -1 ||
              asset === 'BUILD_ID' ||
              asset.indexOf('dist/') === 0
            ) {
              return null;
            }

            if (asset[0] === '/') {
              return asset;
            }

            if (asset.indexOf('bundles/pages/') === 0) {
              return `/_next/-/${asset
                .replace('bundles/pages', 'page')
                .replace('index.js', '')
                .replace(/\.js$/, '')}`;
            }

            return `/_next/-/${asset}`;
          },
          autoUpdate: 1000 * 60 * 5,
          __tests: dev ? { ignoreRuntime: true } : {},
          ServiceWorker: {
            events: true,
            navigateFallbackURL: '/'
          },
          AppCache: {
            directory: './',
            events: true
          }
        })
      );
    }

    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
      })
    );

    return config;
  },

  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: lessToJS(
      fs.readFileSync(
        path.resolve(__dirname, './static/antd-custom.less'),
        'utf8'
      )
    ) // make your antd custom effective
  }
};

if (process.env.STATIC_EXPORT) {
  initExport.exportPathMap = function exportPathMap() {
    const routes = {};
    routes['/'] = {
      page: '/'
    };
    router.routes.forEach(route => {
      if (!route.pattern.includes(':')) {
        routes[route.pattern] = {
          page: route.page
        };
      }
    });

    return routes;
  };
}

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = () => {};
}

/* eslint-enable global-require */
module.exports = withLess(withCSS(initExport));
