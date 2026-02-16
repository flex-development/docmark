/**
 * @file E2E Tests - api
 * @module docmark-factory-whitespace/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-factory-whitespace'

describe('e2e:docmark-factory-whitespace', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
