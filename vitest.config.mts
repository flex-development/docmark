/**
 * @file Configuration - Vitest
 * @module config/vitest
 * @see https://vitest.dev/config
 */

import Notifier from '#tests/reporters/notifier'
import VerboseReporter from '#tests/reporters/verbose'
import listWorkspaces from '#utils/list-workspaces'
import pathe from '@flex-development/pathe'
import { ok } from 'devlop'
import ci from 'is-ci'
import type { Dirent } from 'node:fs'
import {
  defineConfig,
  type ConfigEnv,
  type TestProjectInlineConfiguration,
  type ViteUserConfig
} from 'vitest/config'
import type {
  ResolveSnapshotPathHandlerContext
} from 'vitest/node'
import pkg from './package.json' with { type: 'json' }
import tsconfig from './tsconfig.json' with { type: 'json' }

export default defineConfig(config)

/**
 * Create a vitest configuration.
 *
 * @see {@linkcode ConfigEnv}
 * @see {@linkcode ViteUserConfig}
 *
 * @this {void}
 *
 * @param {ConfigEnv} env
 *  Configuration environment
 * @return {ViteUserConfig}
 *  Root vitest configuration object
 */
function config(this: void, env: ConfigEnv): ViteUserConfig {
  /**
   * The list of workspace directories.
   *
   * @const {ReadonlyArray<Dirent>} workspaces
   */
  const workspaces: readonly Dirent[] = listWorkspaces()

  return {
    test: {
      allowOnly: !ci,
      chaiConfig: {
        includeStack: true,
        showDiff: true,
        truncateThreshold: 0
      },
      clearMocks: true,
      coverage: {
        clean: true,
        cleanOnRerun: true,
        exclude: [
          '**/*.d.mts',
          '**/__fixtures__/',
          '**/__mocks__/',
          '**/__tests__/',
          '**/interfaces/',
          '**/types/'
        ],
        ignoreClassMethods: [],
        include: ['packages/**/src/**/*.mts'],
        provider: 'v8',
        reportOnFailure: !ci,
        reporter: env.mode === 'reports'
          ? ['text']
          : [ci ? 'lcovonly' : 'html', 'json-summary', 'text'],
        reportsDirectory: 'coverage',
        skipFull: false,
        thresholds: { 100: true, perFile: true }
      },
      globalSetup: [],
      globals: true,
      include: ['**/__tests__/*.spec.mts'],
      mockReset: true,
      outputFile: {
        blob: pathe.join('.vitest-reports', env.mode + '.blob.json'),
        json: pathe.join('__tests__', 'reports', env.mode + '.json'),
        junit: pathe.join('__tests__', 'reports', env.mode + '.junit.xml')
      },
      passWithNoTests: true,
      projects: workspaces.flatMap((workspace, groupOrder) => {
        return ['node' as const, 'happy-dom' as const].map(environment => {
          /**
           * The workspace test configuration.
           *
           * @const {TestProjectInlineConfiguration} project
           */
          const project: TestProjectInlineConfiguration = {
            extends: true,
            resolve: {
              conditions: tsconfig.compilerOptions.customConditions,
              preserveSymlinks: true
            },
            root: pathe.join(workspace.parentPath, workspace.name),
            ssr: {
              resolve: {
                conditions: tsconfig.compilerOptions.customConditions
              }
            },
            test: {
              env: { VITEST_ENVIRONMENT: environment },
              environment,
              environmentOptions: {},
              name: { label: workspace.name },
              sequence: { groupOrder },
              setupFiles: [],
              typecheck: {
                allowJs: false,
                checker: 'tsc',
                enabled: env.mode === 'typecheck',
                ignoreSourceErrors: false,
                include: ['**/__tests__/*.spec-d.mts'],
                only: true,
                tsconfig: 'tsconfig.json'
              }
            }
          }

          ok(project.test, 'expected `test`')
          ok(project.test.typecheck, 'expected `test.typecheck`')
          ok(typeof project.test.name === 'object', 'expected `test.name`')

          if (project.test.name.label === 'docmark-util-types') {
            project.mode = 'typecheck'
          }

          project.test.name.label += ':' + environment
          return project
        })
      }),
      reporters: JSON.parse(process.env['VITEST_UI'] ?? '0')
        ? [new Notifier(), new VerboseReporter()]
        : env.mode === 'reports'
        ? [new VerboseReporter()]
        : [
          ci ? 'github-actions' : new Notifier(),
          'blob',
          'json',
          ['junit', { suiteName: pkg.name }],
          new VerboseReporter()
        ],
      /**
       * Store snapshots next to the directory of `file`.
       *
       * @this {void}
       *
       * @param {string} file
       *  The path to the test file
       * @param {string} extension
       *  The snapshot file extension
       * @param {ResolveSnapshotPathHandlerContext} context
       *  The snapshot path handler context
       * @return {string}
       *  The custom snapshot path
       */
      resolveSnapshotPath(
        this: void,
        file: string,
        extension: string,
        context: ResolveSnapshotPathHandlerContext
      ): string {
        const { VITEST_ENVIRONMENT: environment } = context.config.env

        ok(typeof environment === 'string', 'expected `VITEST_ENVIRONMENT`')
        ok(environment, 'expected `VITEST_ENVIRONMENT`')

        return pathe.resolve(
          pathe.dirname(pathe.dirname(file)),
          pathe.join('__snapshots__', environment),
          pathe.basename(file).replace(/\.spec.mts/, '') + extension
        )
      },
      restoreMocks: true,
      server: {
        deps: { // required to apply custom conditions to external deps.
          inline: ['devlop']
        }
      },
      setupFiles: [],
      snapshotFormat: {
        callToJSON: true,
        min: false,
        printBasicPrototype: false,
        printFunctionName: true
      },
      snapshotSerializers: [],
      unstubEnvs: true,
      unstubGlobals: true
    }
  }
}
