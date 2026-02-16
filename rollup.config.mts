/**
 * @file rollup
 * @module config/rollup
 */

import listWorkspaces from '#utils/list-workspaces'
import pathe from '@flex-development/pathe'
import resolve from '@rollup/plugin-node-resolve'
import type { Dirent } from 'node:fs'
import type {
  NormalizedOutputOptions,
  OutputBundle,
  PluginContext,
  RollupOptions
} from 'rollup'
import { dts } from 'rollup-plugin-dts'

/**
 * The rollup configuration.
 *
 * @see {@linkcode RollupOptions}
 *
 * @type {RollupOptions[]}
 */
export default listWorkspaces().map((
  workspace: Dirent,
  index: number,
  workspaces: readonly Dirent[]
): RollupOptions => {
  /**
   * The path to the package directory.
   *
   * @const {string} dir
   */
  const directory: string = pathe.join(workspace.parentPath, workspace.name)

  /**
   * The target file.
   *
   * @const {string} file
   */
  const file: string = pathe.join(directory, 'dist/index.d.mts')

  return {
    external: workspaces.filter(w => !directory.endsWith(w.name)).map(w => {
      return '@flex-development/' + w.name
    }),
    input: file,
    output: [{ file, format: 'esm' }],
    plugins: [
      resolve({ extensions: ['.d.mts', '.mts'] }),
      dts({
        includeExternal: workspace.name === 'docmark-util-types'
          ? ['@flex-development/fsm-tokenizer']
          : []
      }),
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

              if (workspace.name === 'docmark-util-types') {
                output.code = output.code.replaceAll(
                  'export {',
                  'export type {'
                )
              }
            }
          }

          return void this
        },

        /**
         * The plugin name.
         */
        name: 'build:dts'
      }
    ]
  }
})
