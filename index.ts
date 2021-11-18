import path from 'path'
import fs from 'fs-extra'
import type { Compiler, WebpackPluginInstance } from 'webpack'

export class DeleteSourceMapsPlugin implements WebpackPluginInstance {
  readonly isServer: boolean | null = false

  constructor({ isServer }: { isServer: boolean | null } = { isServer: null }) {
    this.isServer = isServer
  }

  apply(compiler: Compiler) {
    compiler.hooks.environment.tap('DeleteSourceMaps', () => {
      // sentry's config currently overrides the devtool value, so we can't set it to hidden-source-map easily
      // see: https://github.com/getsentry/sentry-javascript/issues/3549
      compiler.options.devtool =
        compiler.options.name === 'server' ? false : 'hidden-source-map'
    })
    compiler.hooks.done.tapPromise('DeleteSourceMaps', async (stats) => {
      try {
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
