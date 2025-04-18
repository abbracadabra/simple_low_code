import type { CommonNodeData, ValueSelector, VarType } from '@/components/workflow/types'

export type VariableAggregateNodeType = CommonNodeData & {
  groups: {
    name: string
    // groupId: string
    output_type: VarType
    variables: ValueSelector[]
  }[]
}
