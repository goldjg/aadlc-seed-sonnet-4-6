import { ArgumentsCamelCase, Argv } from 'yargs'
import { outputInfoAsJson, outputInfoAsText } from './info.formatter'

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

const VALID_FORMATS: OutputFormat[] = ['text', 'json']

export async function handler(argv: ArgumentsCamelCase<InfoArgv>) {
  if (argv.format !== undefined && !VALID_FORMATS.includes(argv.format as OutputFormat)) {
    throw new Error(`Invalid format: "${argv.format}". Must be one of: ${VALID_FORMATS.join(', ')}`)
  }

  if (argv.format === 'json') {
    outputInfoAsJson(argv)
    return
  }

  outputInfoAsText(argv)
}
