// import type { CollectionType } from '@/components/tools/types'
import type { CommonNodeData, ValueSelector } from '@/components/workflow/types'

// export enum VarType {
//   variable = 'variable', // 只能引用
//   constant = 'constant', // 
//   mixed = 'mixed', // 引用+constant，例如：{{#sys.app_id#}}4334
// }

// export type ToolVarInputs = Record<string, {
//   // type: VarType // 数据来源：手写、引用变量、引用变量+手写
//   // value?: ValueSelector//type=const->a23d,type=variable->['sys','...'],type=mixed->"{{#sys.app_id#}}4334"
//   value: string | ValueSelector// 用{{xxx}}表示引用
//   // isReference: 是否是引用
//   // 数据类型、required 什么的在schema里
// }>

export type ToolNodeType = CommonNodeData & {
  // provider_id: string
  // provider_type: CollectionType
  // provider_name: string
  tool_name: string
  // tool_label: string
  // tool_parameters: ToolVarInputs // 这里的var没有label，没有type，因为在schema里，只有name,value_selector
  // tool_configurations: Record<string, any> // 同样，有schema，这里只存name,value

  tool_parameters: Record<string, string | ValueSelector>
}
