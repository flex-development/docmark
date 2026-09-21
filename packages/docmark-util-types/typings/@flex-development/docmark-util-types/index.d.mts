import type { LanguageOptions } from '@flex-development/docmark-util-types'

declare module '@flex-development/docmark-util-types' {
  interface JsOptions extends LanguageOptions {
    jsdoc?: Record<string, any> | undefined
  }

  interface Settings {
    javascript?: JsOptions
  }
}
