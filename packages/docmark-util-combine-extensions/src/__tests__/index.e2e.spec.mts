/**
 * @file E2E Tests - api
 * @module docmark-util-combine-extensions/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-util-combine-extensions'

describe('e2e:docmark-util-combine-extensions', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
