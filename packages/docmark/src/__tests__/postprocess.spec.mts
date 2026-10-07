/**
 * @file Unit Tests - postprocess
 * @module docmark/tests/unit/postprocess
 */

import { subtokenize } from '@flex-development/docmark-util-subtokenize'
import type { Event } from '@flex-development/docmark-util-types'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import testSubject from '../postprocess.mts'

vi.mock('@flex-development/docmark-util-subtokenize', async og => {
  const module: { subtokenize: typeof subtokenize } = await og()
  return { subtokenize: vi.fn(module.subtokenize).mockName('subtokenize') }
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

  it('should tokenize embedded content', () => {
    expect(subtokenize).toHaveBeenCalledExactlyOnceWith(events)
  })
})
