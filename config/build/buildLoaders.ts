import { type ModuleOptions } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { type IBuildOptions } from './types/types'
import loader from 'mini-css-extract-plugin/types/loader'
import ReactRefreshTypeScript from 'react-refresh-typescript'

export function buildLoaders(options: IBuildOptions): ModuleOptions['rules'] {
  const isDev = options.mode === 'development'

  const svgLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          //options: true позволяет работать с иконками напрямую и управлять размерами, а не viewbox
          icon: true,
          svgoConfig: {
            plugins: [
              {
                name: 'convertColors',
                params: {
                  currentColor: true //важный параметр, который позволит принимать иконке текущий цвет, это позволяет SVG элементу принимать inline стили в виде цвета или классы или просто color=...
                }
              }
            ]
          }
        }
      }
    ]
  }

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: 'asset/resource'
  }

  const cssLoader = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }

  const cssLoaderWithModules = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]' //формирование названия файла
      }
    }
  }

  const scssLoader = {
    test: /\.s[ac]ss$/i,

    use: [
      // Creates `style` nodes from JS strings
      // 'style-loader',
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      // Translates CSS into CommonJS
      cssLoaderWithModules,
      // Compiles Sass to CSS
      'sass-loader'
    ]
  }

  const tsLoader = {
    // ts-loader по умолчанию умеет работать с JSX, поэтому можно не устанавливать Babel-loader для работы с react
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true, //Читай доку https://www.npmjs.com/package/ts-loader#:~:text=..%0A%7D-,Options,-There%20are%20two
          /**
           * Для HMR
           */
          getCustomTransformers: () => ({
            before: [isDev && ReactRefreshTypeScript()].filter(Boolean)
          })
        }
      }
    ],
    exclude: /node_modules/
  }
  return [svgLoader, assetLoader, cssLoader, scssLoader, tsLoader]
}
