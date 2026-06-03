import { expect, describe, it } from '@jest/globals'
import { commands } from './commands'

describe('commands export', () => {
  it('exports an array of three commands', () => {
    expect(Array.isArray(commands)).toBe(true)
    expect(commands).toHaveLength(3)
  })

  it('every command has a command string, describe string, and handler function', () => {
    for (const cmd of commands) {
      expect(typeof cmd.command).toBe('string')
      expect(typeof cmd.describe).toBe('string')
      expect(typeof cmd.handler).toBe('function')
    }
  })

  it('includes info, greeting, and create commands', () => {
    const names = commands.map((c) => (Array.isArray(c.command) ? c.command[0] : c.command))
    expect(names).toContain('info')
    expect(names).toContain('greeting')
    expect(names.some((n) => n?.startsWith('create'))).toBe(true)
  })
})

