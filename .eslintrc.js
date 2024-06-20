module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // Отсылка в prettier config, здесь пишу правила, как реагировать линтеру, если будут какие-то несоответствия с eslint
    'prettier/prettier': [
      'warn',
      {
        endOfLine: 'auto'
      }
    ],
    'react/react-in-jsx-scope': 'off'
  },
  settings: {
    react: {
      version: 'detect' // Или конкретная версия вашего проекта React, например "17.0.2"
    }
  }
}
