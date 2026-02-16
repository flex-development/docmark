/**
 * @file rollup
 * @module config/rollup
 */

import dts from '#build/plugins/dts'
import listWorkspaces from '#utils/list-workspaces'
import pathe from '@flex-development/pathe'
import type { Dirent } from 'node:fs'
import type { RollupOptions } from 'rollup'

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
    plugins: [dts()]
  }
})
