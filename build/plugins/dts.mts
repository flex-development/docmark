/**
 * @file Plugins - dts
 * @module build/plugins/dts
 */

import resolve from '@rollup/plugin-node-resolve'
import type {
  NormalizedOutputOptions,
  OutputBundle,
  Plugin,
  PluginContext
} from 'rollup'
import { dts as bundle } from 'rollup-plugin-dts'

/**
 * The plugin name.
 *
 * @const {string} PLUGIN_NAME
 */
const PLUGIN_NAME: string = 'build:dts'

dts.PLUGIN_NAME = PLUGIN_NAME
export default dts

/**
 * Create a plugin pack to bundle declaration files.
 *
 * @see {@linkcode Plugin}
 *
 * @this {void}
 *
 * @return {Plugin[]}
 *  The plugin pack
 */
function dts(this: void): Plugin[] {
  return [
    resolve({ extensions: ['.d.mts', '.mts'] }),
    bundle(),
    {
      /**
       * Re-add lost `type` modifiers.
       *
       * @see https://github.com/Swatinem/rollup-plugin-dts/issues/354
       *
       * @this {PluginContext}
       *
       * @param {NormalizedOutputOptions} options
       *  The normalized output options
       * @param {OutputBundle} bundle
       *  The output bundle object
       * @return {undefined}
       */
      generateBundle(
        this: PluginContext,
        options: NormalizedOutputOptions,
        bundle: OutputBundle
      ): undefined {
        for (const output of Object.values(bundle)) {
          if (output.type === 'chunk') {
            output.code = output.code
              .replaceAll('import *', 'import type *')
              .replaceAll('import {', 'import type {')

            if (output.facadeModuleId?.includes('/docmark-util-types/dist/')) {
              output.code = output.code.replaceAll('export {', 'export type {')
            }
          }
        }

        return void this
      },

      /**
       * The plugin name.
       */
      name: PLUGIN_NAME
    }
  ]
}
