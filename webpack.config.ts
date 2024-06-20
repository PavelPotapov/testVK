import path from 'path'
import webpack from 'webpack'
import { buildWebpack } from './config/build/buildWebpack'
import { BuildMode, BuildPlatform, IBuildPaths } from './config/build/types/types'

type Mode = 'production' | 'development'

interface envVariables {
  mode?: BuildMode
  port?: number
  analyzer: boolean
  platform?: BuildPlatform
}

export default (env: envVariables) => {
  const paths: IBuildPaths = {
    output: path.resolve(__dirname, 'build'),
    entry: path.resolve(__dirname, 'src', 'main.tsx'),
    html: path.resolve(__dirname, 'public', 'index.html'),
    src: path.resolve(__dirname, 'src')
  }
  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? 'development',
    paths,
    analyzer: env.analyzer,
    platform: env.platform ?? 'desktop'
  })
  return config
}
