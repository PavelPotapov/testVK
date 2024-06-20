declare module '*.module.scss' {
  //объявление модуля TypeScript Оно указывает TypeScript, что для файлов с расширением .css будет использоваться определенный тип модуля. В этом случае, это указание для TypeScript о том, что файлы CSS будут импортироваться как модули.

  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
  // const classes: { readonly [key: string]: string }
  // export default classes
}

declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'

declare module '*.svg' {
  import React from 'react'
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>
  export default SVG
}

declare const __PLATFORM__: 'desktop' | 'mobile'
declare const __MODE__: 'production' | 'development'