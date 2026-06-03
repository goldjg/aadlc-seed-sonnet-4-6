import { expect, jest, describe, it, beforeEach, afterEach } from '@jest/globals'
import { handler, builder, command, aliases } from './greeting'
import { logger } from '../logger'

describe('greeting command', () => {
  describe('metadata', () => {
    it('exports command string "greeting"', () => {
      expect(command).toBe('greeting')
    })

    it('exports aliases including "g"', () => {
      expect(aliases).toContain('g')
    })
  })

  describe('builder', () => {
    it('returns the yargs instance unchanged', () => {
      const mockYargs = {} as Parameters<typeof builder>[0]
      const result = builder(mockYargs)
      expect(result).toBe(mockYargs)
    })
  })

  describe('handler', () => {
    let promptSpy: ReturnType<typeof jest.spyOn>
    let logSpy: ReturnType<typeof jest.spyOn>

    beforeEach(() => {
      promptSpy = jest.spyOn(logger, 'prompt')
      logSpy = jest.spyOn(logger, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      promptSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('prompts for a name and then a mood', async () => {
      promptSpy.mockResolvedValueOnce('Alice').mockResolvedValueOnce('👍')
      await handler()
      expect(promptSpy).toHaveBeenCalledTimes(2)
    })

    it('first prompt asks for the user name', async () => {
      promptSpy.mockResolvedValueOnce('Alice').mockResolvedValueOnce('👍')
      await handler()
      const firstCall = promptSpy.mock.calls[0] as unknown[]
      expect(firstCall[0]).toMatch(/name/i)
    })

    it('second prompt asks about mood', async () => {
      promptSpy.mockResolvedValueOnce('Alice').mockResolvedValueOnce('👍')
      await handler()
      const secondCall = promptSpy.mock.calls[1] as unknown[]
      expect(secondCall[0]).toMatch(/how are you/i)
    })

    it('logs a greeting containing the entered name', async () => {
      promptSpy.mockResolvedValueOnce('Alice').mockResolvedValueOnce('👍')
      await handler()
      const greetingCall = logSpy.mock.calls[0]?.[0] as string
      expect(greetingCall).toContain('Alice')
    })

    it('logs a farewell containing the name and selected mood', async () => {
      promptSpy.mockResolvedValueOnce('Bob').mockResolvedValueOnce('👌')
      await handler()
      const farewellCall = logSpy.mock.calls[1]?.[0] as string
      expect(farewellCall).toContain('Bob')
      expect(farewellCall).toContain('👌')
    })
  })
})
