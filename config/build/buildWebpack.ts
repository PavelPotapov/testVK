import type webpack from 'webpack'
import { buildDevServer } from './buildDevServer'
import { buildLoaders } from './buildLoaders'
import { buildPlugins } from './buildPlugins'
import { buildResolvers } from './buildResolvers'
import { type IBuildOptions } from './types/types'

export function buildWebpack(options: IBuildOptions): webpack.Configuration {
  const { mode, paths } = options
  const isDev = mode === 'development'
  return {
    mode,
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: '[name].[contenthash].js',
      clean: true, // Clean the output directory before emit.
      chunkFilename: 'lazy/[name].[chunkhash].js'
    },
    plugins: buildPlugins(options),
    module: {
      // в массиве rules указываются loaders в нужном порядке
      rules: buildLoaders(options)
    },
    // resolver, порядок важен
    resolve: buildResolvers(options),
    devServer: isDev ? buildDevServer(options) : undefined,
    devtool: isDev ? 'inline-source-map' : false
  }
}
