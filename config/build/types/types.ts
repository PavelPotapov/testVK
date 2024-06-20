export interface IBuildPaths {
  entry: string
  html: string
  output: string
  src: string
}

export type BuildMode = 'production' | 'development'

export type BuildPlatform = 'desktop' | 'mobile'

export interface IBuildOptions {
  port: number
  paths: IBuildPaths
  mode: BuildMode
  analyzer?: boolean
  platform?: BuildPlatform
}
