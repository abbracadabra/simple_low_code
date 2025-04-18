// import type { VarType } from '@/components/workflow/types'

import { SimpleVarSchema, VarType } from "../workflow/types"

// export enum CollectionType {
//     // all = 'all',
//     // builtIn = 'builtin',
//     custom = 'api',
//     // model = 'model',
//     workflow = 'workflow',
//   }

// 原ToolParameter
// 参数签名，类似start节点的InputVar
export type ToolInputVarSchema = {
    name: string
    type: VarType
    desc?: string
    // human_description: string
    // type: string
    // options
    // constantOnly: boolean // 只能手填，不能引用
    // selector、input、select

    // form: string
    // llm_description: string
    required?: boolean
    // default?: string
    // options?: {
    //   label: TypeWithI18N
    //   value: string
    // }[]
    // options?: string[]
    // min?: number
    // max?: number
  }

// tool查询接口返回的数据
export type Tool = {
    name: string // 相当于id
    // author: string
    label: string
    description: any
    parameters: ToolInputVarSchema[], // 运行时参数
    // labels: string[]

    // type: CollectionType,
    icon: string,

    outputVars: SimpleVarSchema[]
}



// export type ToolOutputVarSchema = {
//     name: string
//     desc?: string
//     type: VarType
// }