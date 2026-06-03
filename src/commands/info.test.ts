import { expect, jest, describe, it, beforeEach, afterEach } from '@jest/globals'
import { handler, builder, OutputFormat } from './info'
import { logger } from '../logger'
import { ArgumentsCamelCase } from 'yargs'

type InfoArgv = { full?: boolean; format?: OutputFormat; [key: string]: unknown }

describe('info command', () => {
  let stdoutSpy: ReturnType<typeof jest.spyOn>

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true)
  })

  afterEach(() => {
    stdoutSpy.mockRestore()
  })

  describe('--format json', () => {
    it('emits valid JSON to stdout', async () => {
      const argv = { full: false, format: 'json' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)

      expect(stdoutSpy).toHaveBeenCalledTimes(1)
      const written = stdoutSpy.mock.calls[0][0] as string
      expect(() => JSON.parse(written)).not.toThrow()
    })

    it('JSON output contains required keys: node, arch, cwd, memoryUsage, argv', async () => {
      const argv = { full: false, format: 'json' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)

      const written = stdoutSpy.mock.calls[0][0] as string
      const parsed = JSON.parse(written) as Record<string, unknown>
      expect(parsed).toHaveProperty('node')
      expect(parsed).toHaveProperty('arch')
      expect(parsed).toHaveProperty('cwd')
      expect(parsed).toHaveProperty('memoryUsage')
      expect(parsed).toHaveProperty('argv')
    })

    it('includes processConfig when --full is true', async () => {
      const argv = { full: true, format: 'json' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)

      const written = stdoutSpy.mock.calls[0][0] as string
      const parsed = JSON.parse(written) as Record<string, unknown>
      expect(parsed).toHaveProperty('processConfig')
    })

    it('omits processConfig when --full is false', async () => {
      const argv = { full: false, format: 'json' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)

      const written = stdoutSpy.mock.calls[0][0] as string
      const parsed = JSON.parse(written) as Record<string, unknown>
      expect(parsed).not.toHaveProperty('processConfig')
    })
  })

  describe('--format text (default)', () => {
    it('does not write to stdout in text mode', async () => {
      const argv = { full: false, format: 'text' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)

      expect(stdoutSpy).not.toHaveBeenCalled()
    })
  })

  describe('invalid format', () => {
    it('throws an error when an invalid format is supplied', async () => {
      const argv = { full: false, format: 'xml' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await expect(handler(argv)).rejects.toThrow('Invalid format: "xml". Must be one of: text, json')
    })

    it('error message names the invalid value', async () => {
      const argv = { full: false, format: 'csv' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await expect(handler(argv)).rejects.toThrow('"csv"')
    })

    it('does not write to stdout when format is invalid', async () => {
      const argv = { full: false, format: 'xml' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await expect(handler(argv)).rejects.toThrow()
      expect(stdoutSpy).not.toHaveBeenCalled()
    })
  })

  describe('builder', () => {
    it('registers format option with choices text and json', () => {
      const choicesSpy = jest.fn().mockReturnThis()
      const optionSpy = jest.fn().mockReturnThis()
      const mockYargs = { option: optionSpy, choices: choicesSpy } as unknown as Parameters<typeof builder>[0]

      // Capture option calls to verify format is registered
      let formatOptions: Record<string, unknown> | undefined
      optionSpy.mockImplementation((name: unknown, opts: unknown) => {
        if (name === 'format') formatOptions = opts as Record<string, unknown>
        return mockYargs
      })

      builder(mockYargs)

      expect(formatOptions).toBeDefined()
      expect(formatOptions?.choices).toEqual(['text', 'json'])
      expect(formatOptions?.default).toBe('text')
    })

    it('registers full option as boolean with default true', () => {
      const optionSpy = jest.fn().mockReturnThis()
      const mockYargs = { option: optionSpy } as unknown as Parameters<typeof builder>[0]

      let fullOptions: Record<string, unknown> | undefined
      optionSpy.mockImplementation((name: unknown, opts: unknown) => {
        if (name === 'full') fullOptions = opts as Record<string, unknown>
        return mockYargs
      })

      builder(mockYargs)

      expect(fullOptions).toBeDefined()
      expect(fullOptions?.type).toBe('boolean')
      expect(fullOptions?.default).toBe(true)
    })

    it('registers full option with alias f', () => {
      const optionSpy = jest.fn().mockReturnThis()
      const mockYargs = { option: optionSpy } as unknown as Parameters<typeof builder>[0]

      let fullOptions: Record<string, unknown> | undefined
      optionSpy.mockImplementation((name: unknown, opts: unknown) => {
        if (name === 'full') fullOptions = opts as Record<string, unknown>
        return mockYargs
      })

      builder(mockYargs)

      expect(fullOptions?.alias).toBe('f')
    })
  })

  describe('--format text logger calls', () => {
    let infoSpy: ReturnType<typeof jest.spyOn>
    let boxSpy: ReturnType<typeof jest.spyOn>

    beforeEach(() => {
      infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => {})
      boxSpy = jest.spyOn(logger, 'box').mockImplementation(() => {})
    })

    afterEach(() => {
      infoSpy.mockRestore()
      boxSpy.mockRestore()
    })

    it('calls logger.info at least once in text mode', async () => {
      const argv = { full: false, format: 'text' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)
      expect(infoSpy).toHaveBeenCalled()
    })

    it('calls logger.box when full=true in text mode', async () => {
      const argv = { full: true, format: 'text' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)
      expect(boxSpy).toHaveBeenCalled()
    })

    it('does not call logger.box when full=false in text mode', async () => {
      const argv = { full: false, format: 'text' as OutputFormat } as ArgumentsCamelCase<InfoArgv>
      await handler(argv)
      expect(boxSpy).not.toHaveBeenCalled()
    })
  })
})
