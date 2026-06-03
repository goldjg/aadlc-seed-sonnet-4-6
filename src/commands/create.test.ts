import { expect, jest, describe, it, beforeEach, afterEach } from '@jest/globals'
import { builder, handler, command, aliases } from './create'
import { logger } from '../logger'
import { downloadTemplate } from 'giget'
import { join } from 'path'
import * as process from 'node:process'
import { ArgumentsCamelCase } from 'yargs'

jest.mock('giget')

type CreateArgv = { path: string; [key: string]: unknown }

describe('create command', () => {
  describe('metadata', () => {
    it('exports command string with positional path', () => {
      expect(command).toBe('create <path>')
    })

    it('exports aliases including "c"', () => {
      expect(aliases).toContain('c')
    })
  })

  describe('builder path coerce', () => {
    function captureCoerce(): (v: string) => string {
      let coerceFn: ((v: string) => string) | undefined
      const mockYargs = {
        positional: jest.fn().mockReturnThis(),
        coerce: jest.fn().mockImplementation((name: unknown, fn: unknown) => {
          if (name === 'path') coerceFn = fn as (v: string) => string
          return mockYargs
        }),
      } as unknown as Parameters<typeof builder>[0]

      builder(mockYargs)

      if (!coerceFn) throw new Error('coerce for path was not registered')
      return coerceFn
    }

    it('keeps absolute paths unchanged', () => {
      const coerce = captureCoerce()
      const absPath = '/absolute/path'
      expect(coerce(absPath)).toBe(absPath)
    })

    it('joins relative paths with cwd', () => {
      const coerce = captureCoerce()
      expect(coerce('my-project')).toBe(join(process.cwd(), 'my-project'))
    })
  })

  describe('handler', () => {
    let promptSpy: ReturnType<typeof jest.spyOn>
    let boxSpy: ReturnType<typeof jest.spyOn>
    let errorSpy: ReturnType<typeof jest.spyOn>
    const mockDT = jest.mocked(downloadTemplate)

    beforeEach(() => {
      promptSpy = jest.spyOn(logger, 'prompt')
      boxSpy = jest.spyOn(logger, 'box').mockImplementation(() => {})
      errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => {})
      mockDT.mockReset()
    })

    afterEach(() => {
      promptSpy.mockRestore()
      boxSpy.mockRestore()
      errorSpy.mockRestore()
    })

    it('does not call downloadTemplate when user declines', async () => {
      promptSpy.mockResolvedValue(false)
      const argv = { path: '/some/path' } as ArgumentsCamelCase<CreateArgv>
      await handler(argv)
      expect(mockDT).not.toHaveBeenCalled()
    })

    it('calls downloadTemplate with correct template and dir when user confirms', async () => {
      promptSpy.mockResolvedValue(true)
      mockDT.mockResolvedValue({} as ReturnType<typeof downloadTemplate> extends Promise<infer T> ? T : never)
      const argv = { path: '/some/path' } as ArgumentsCamelCase<CreateArgv>
      await handler(argv)
      expect(mockDT).toHaveBeenCalledWith('gh:kucherenko/cli-typescript-starter', { dir: '/some/path' })
    })

    it('displays success box after successful download', async () => {
      promptSpy.mockResolvedValue(true)
      mockDT.mockResolvedValue({} as ReturnType<typeof downloadTemplate> extends Promise<infer T> ? T : never)
      const argv = { path: '/some/path' } as ArgumentsCamelCase<CreateArgv>
      await handler(argv)
      expect(boxSpy).toHaveBeenCalled()
    })

    it('logs error message when downloadTemplate throws', async () => {
      promptSpy.mockResolvedValue(true)
      mockDT.mockRejectedValue(new Error('Network error'))
      const argv = { path: '/some/path' } as ArgumentsCamelCase<CreateArgv>
      await handler(argv)
      expect(errorSpy).toHaveBeenCalled()
    })
  })
})
