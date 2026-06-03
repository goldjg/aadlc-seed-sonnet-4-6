import { ArgumentsCamelCase, Argv } from 'yargs'
import { logger } from '../logger'
import * as process from 'node:process'
import { blue, bold, gray, green, red, yellow } from 'picocolors'

export type OutputFormat = 'text' | 'json'

interface InfoArgv {
  full?: boolean
  format?: OutputFormat
}

export const command = 'info'
export const describe = 'Basic command to display information about the CLI application.'
export const aliases = ['i']

export function builder(yargs: Argv): Argv {
  return yargs
    .option('full', {
      type: 'boolean',
      alias: 'f',
      default: true,
    })
    .option('format', {
      type: 'string',
      alias: 'o',
      choices: ['text', 'json'] as const,
      default: 'text',
      description: 'Output format (text or json)',
    })
}

export async function handler(argv: ArgumentsCamelCase<InfoArgv>) {
  if (argv.format === 'json') {
    const output: Record<string, unknown> = {
      node: process.version,
      arch: process.arch,
      cwd: process.cwd(),
      memoryUsage: process.memoryUsage(),
      argv,
    }
    if (argv.full) {
      output.processConfig = process.config
    }
    process.stdout.write(JSON.stringify(output, null, 2) + '\n')
    return
  }

  logger.info(bold(red('Basic command to display information about the CLI application.')))
  logger.info(green('Node:'), bold(process.version))
  logger.info(yellow('Processor architecture:'), process.arch)
  logger.info(blue('Current dir:'), process.cwd())
  logger.info(gray('Memory usage:'), process.memoryUsage())
  logger.info(gray('Argv:'), argv)
  if (argv.full) {
    logger.box(gray(bold('Process config:')), process.config)
  }
}
