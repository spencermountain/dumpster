import type { DumpsterOptions, DumpsterPool } from './index.d.ts'

export type CliParamType = 'path' | 'string' | 'number' | 'select' | 'boolean'

export interface CliChoice<Value = unknown> {
  value: Value
  label: string
}

export interface CliParam {
  name: string
  cliName?: string
  flags: string
  negativeFlags?: string
  desc: string
  negativeDesc?: string
  type: CliParamType
  choices?: Array<string | CliChoice>
  required?: boolean
  parse?: (value: string) => unknown
}

export interface CliConfig<ExtraOptions extends object = Record<string, unknown>> {
  name?: string
  description?: string
  version?: string
  params?: CliParam[]
  defaults?: Partial<DumpsterOptions & ExtraOptions>
  writer?: (pool: DumpsterPool, options: DumpsterOptions & ExtraOptions) => void
}

declare function run<ExtraOptions extends object = Record<string, unknown>>(
  config?: CliConfig<ExtraOptions>
): Promise<void>

export { run }
export default run
