/**
 * @file Unit Tests - ct
 * @module docmark-util-symbol/tests/unit/ct
 */

import constants from '../constants.mts'
import testSubject from '../ct.mts'

describe('unit:ct', () => {
  let keys: string[]

  beforeAll(() => {
    keys = [
      constants.contentTypeSource,
      constants.contentTypeComment,
      constants.contentTypeDocument,
      constants.contentTypeFlow,
      constants.contentTypeContent,
      constants.contentTypeText,
      constants.contentTypeString
    ]
  })

  it('should be content type dictionary', () => {
    expect(testSubject).to.have.keys(keys)
    expect(testSubject).to.have.property('comment', keys[1])
    expect(testSubject).to.have.property('content', keys[4])
    expect(testSubject).to.have.property('document', keys[2])
    expect(testSubject).to.have.property('flow', keys[3])
    expect(testSubject).to.have.property('source', keys[0])
    expect(testSubject).to.have.property('string', keys[6])
    expect(testSubject).to.have.property('text', keys[5])
  })
})
