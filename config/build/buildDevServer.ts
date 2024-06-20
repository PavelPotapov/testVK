import type { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import { type IBuildOptions } from './types/types'

export function buildDevServer(options: IBuildOptions): DevServerConfiguration {
  return {
    port: options.port ?? 3000,
    open: true,
    historyApiFallback: true //разрешаем использование api history для роутинга react приложения. Работает только для devserver, если раздавать статику через nginx надо делать проксирование на index.html
  }
}
