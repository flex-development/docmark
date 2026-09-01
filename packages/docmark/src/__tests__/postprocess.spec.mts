/**
 * @file Unit Tests - postprocess
 * @module docmark/tests/unit/postprocess
 */

import { subtokenize } from '@flex-development/docmark-util-subtokenize'
import type { Event } from '@flex-development/docmark-util-types'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import testSubject from '../postprocess.mts'
import resolveRegionExists from '../resolvers/region-exits.mts'

vi.mock('@flex-development/docmark-util-subtokenize', async og => {
  const module: { subtokenize: typeof subtokenize } = await og()
  return { subtokenize: vi.fn(module.subtokenize).mockName('subtokenize') }
})

vi.mock('../resolvers/region-exits.mts', async og => {
  const module: { default: typeof resolveRegionExists } = await og()
  return { default: vi.fn(module.default).mockName('resolveRegionExists') }
})

describe('unit:postprocess', () => {
  let events: Event[]
  let result: Event[]

  beforeAll(() => {
    events = []
  })

  beforeEach(() => {
    result = testSubject(events)
  })

  it('should return `events`', () => {
    expect(result).to.eq(events)
  })

  it('should fix region exits after tokenizing embedded content', () => {
    expect(resolveRegionExists).toHaveBeenCalledExactlyOnceWith(events)
    expect(resolveRegionExists).toHaveBeenCalledAfter(vi.mocked(subtokenize))
  })

  it('should tokenize embedded content', () => {
    expect(subtokenize).toHaveBeenCalledExactlyOnceWith(events)
  })
})
