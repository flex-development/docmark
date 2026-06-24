/**
 * @file Type Tests - Effects
 * @module docmark-util-types/tests/unit-d/Effects
 */

import type {
  Attempt,
  Check,
  Consume,
  Enter,
  Exit,
  Interrupt
} from '@flex-development/docmark-util-types'
import type TestSubject from '../effects.mts'

describe('unit-d:interfaces/Effects', () => {
  it('should match [attempt: Attempt]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('attempt')
      .toEqualTypeOf<Attempt>()
  })

  it('should match [check: Check]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('check').toEqualTypeOf<Check>()
  })

  it('should match [consume: Consume]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('consume')
      .toEqualTypeOf<Consume>()
  })

  it('should match [enter: Enter]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('enter').toEqualTypeOf<Enter>()
  })

  it('should match [exit: Exit]', () => {
    expectTypeOf<TestSubject>().toHaveProperty('exit').toEqualTypeOf<Exit>()
  })

  it('should match [interrupt: Interrupt]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('interrupt')
      .toEqualTypeOf<Interrupt>()
  })
})
