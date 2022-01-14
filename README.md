# webpack-delete-sourcemaps-plugin

Webpack plugin to delete sourcemaps at the end of a build. Useful for deleting sourcemaps after uploading them to sentry for example so they don't end up on your production server.

Why is having sourcemaps exposed bad? It is a "source code disclosure" security risk, meaning it's exposing a human readable version of your code which makes it easier for an attacker to find logical flaws for example, or abuse some part of your codebase.

## Compatibility

This plugin is written to be compatible with **Webpack 5**. It currently doesn't support previous versions of webpack.
## NextJS and Sentry

I created this plugin so we can upload sourcemaps to **sentry** when using **NextJS** and then remove those sourcemaps before the deployment. So during a production build/deployment the sourcemaps are correctly uploaded to **sentry** but not exposed in the live app. 

## How to use

```
npm install webpack-delete-sourcemaps-plugin --save-dev
``` 

```js
const { DeleteSourceMapsPlugin } = require('webpack-delete-sourcemaps-plugin');

module.exports = {
  devtool: 'hidden-source-map', // optional, see the #hidden-source-map section for more info
  // ...
  plugins: [
    new DeleteSourceMapsPlugin()
  ]
}
```

## How to use with NextJS

To use with **NextJS** and **sentry**, add this piece to your `next.config.js` configuration:

```js
const { DeleteSourceMapsPlugin } = require('webpack-delete-sourcemaps-plugin');

{
  // ...
  webpack: (config, { isServer }) => {
    config.plugins.push(new DeleteSourceMapsPlugin({ isServer, keepServerSourcemaps: true }))
    return config
  }
}
```

## hidden-source-map

By generating the sourcemaps and then removing them, it will keep the sourcemap reference in the .js even if it's removed, which can cause the browser to call those and generate 404. To avoid this, we can set the devtool value to `hidden-source-map` 

For nextjs config using `withSentryConfig`, we can't set the devtool value to hidden-source-map as it's overriden by the sentry config wrapper, this plugin will take care of overriding the devtool value to set it it `hidden-source-map` for the client build (and will set it to false for the server build)

more info: https://webpack.js.org/configuration/devtool/#production
based on that thread: https://github.com/getsentry/sentry-webpack-plugin/issues/56
sentry issue with implemented solution: https://github.com/getsentry/sentry-javascript/issues/3549#issuecomment-954552144




