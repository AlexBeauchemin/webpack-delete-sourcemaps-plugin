# webpack-delete-sourcemaps-plugin

Webpack plugin to delete sourcemaps at the end of a build. Useful for deleting sourcemaps after uploading them to sentry for example so they don't end up on your production server.

Why is having sourcemaps exposed bad? It is a "source code disclosure" security risk, meaning it's exposing a human readable version of your code which makes it easier for an attacker to find logical flaws for example, or abuse some part of your codebase.

## Compatibility

This plugin is written to be compatible with **Webpack 5**. It currently doesn't support previous versions of webpack.
## NextJS and Sentry

I created this plugin so we can upload sourcemaps to **sentry** when using **NextJS** and then remove those sourcemaps before the deployment. So during a production build/deployment the sourcemaps are correctly uploaded to **sentry** but not exposed in the live app. 

## How to use

```js
const { DeleteSourceMapsPlugin } = require('webpack-delete-sourcemaps-plugin');

module.exports = {
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
    config.plugins.push(new DeleteSourceMapsPlugin({ isServer }))
    return config
  }
}
```




