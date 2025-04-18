import type { CommonNodeData, SimpleVarSchema, VarType, VarWithSelector } from '@/components/workflow/types'

export enum CodeLanguage {
  python3 = 'python3',
  javascript = 'javascript',
  // json = 'json',
}

// 类似tool的ToolOutputVar
// export type OutputVarSchema = {
//   name: string
//   type: VarType
//   desc: string
//   // children: null // support nest in the future,
// }

export type CodeNodeType = CommonNodeData & {
  variables: VarWithSelector[] // arg1, arg2 诸如此   // todo 这里要type，因为code需要序列化反序列化
  code_language: CodeLanguage
  code: string
  outputs: SimpleVarSchema[]
}
