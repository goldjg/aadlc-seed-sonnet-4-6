import * as process from 'node:process'
import { ArgumentsCamelCase } from 'yargs'
import { blue, bold, gray, green, red, yellow } from 'picocolors'
import { logger } from '../logger'
import { OutputFormat } from './info'

type InfoArgv = ArgumentsCamelCase<{ full?: boolean; format?: OutputFormat; [key: string]: unknown }>

export function outputInfoAsJson(argv: InfoArgv): void {
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
}

export function outputInfoAsText(argv: InfoArgv): void {
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
