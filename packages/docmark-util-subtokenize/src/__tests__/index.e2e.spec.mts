/**
 * @file E2E Tests - api
 * @module docmark-util-subtokenize/tests/e2e/api
 */

import * as testSubject from '@flex-development/docmark-util-subtokenize'

describe('e2e:docmark-util-subtokenize', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})
