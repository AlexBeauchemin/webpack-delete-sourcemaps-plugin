import path from 'path'
import fs from 'fs-extra'
import type { Compiler, WebpackPluginInstance } from 'webpack'

interface ConstructorProps {
  isServer: boolean | null;
  keepServerSourcemaps: boolean | null;
}

export class DeleteSourceMapsPlugin implements WebpackPluginInstance {
  readonly isServer: boolean | null = false
  readonly keepServerSourcemaps: boolean | null = false

  constructor({ isServer, keepServerSourcemaps }: ConstructorProps = { isServer: null, keepServerSourcemaps: null }) {
    if (keepServerSourcemaps && isServer === null) throw new Error('You need to define the "isServer" value if you want to use "keepServerSourcemaps"')
    this.isServer = isServer
    this.keepServerSourcemaps = keepServerSourcemaps
  }

  apply(compiler: Compiler) {
    compiler.hooks.environment.tap('DeleteSourceMaps', () => {
      console.log('WEBPACK SOURCEMAPS PLUGIN environment tap', this.isServer, this.keepServerSourcemaps)
      if (this.isServer && this.keepServerSourcemaps) return
      // sentry's config currently overrides the devtool value, so we can't set it to hidden-source-map easily
      // see: https://github.com/getsentry/sentry-javascript/issues/3549
      compiler.options.devtool =
        compiler.options.name === 'server' ? false : 'hidden-source-map'
    })
    compiler.hooks.done.tapPromise('DeleteSourceMaps', async (stats) => {
      try {
        console.log('WEBPACK SOURCEMAPS PLUGIN done tap', this.isServer, this.keepServerSourcemaps)
        if (this.isServer && this.keepServerSourcemaps) return

        const { compilation } = stats
        const outputPath = compilation.outputOptions.path
        const promises = Object
          .keys(compilation.assets)
          .filter((filename) => filename.endsWith('.js.map') || filename.endsWith('.css.map'))
          .map((filename) => {
            if (!outputPath) return Promise.resolve()
            const filePath = path.join(outputPath, filename)
            return fs.remove(filePath)
          })
        await Promise.all(promises)

        const env = this.isServer ? 'server' : 'client'

        if (this.isServer === null) console.info(`⚠️  Deleted ${promises.length} source map files`)
        else console.info(`⚠️  Deleted ${promises.length} ${env} source map files`)
      } catch (err) {
        console.warn('⚠️  DeleteSourceMapsPlugin: Error while deleting source maps after the build')
        console.error(err)
      }
    })
  }
}
