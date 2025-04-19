import type { CommonNodeData, ValueSelector, VarType } from '@/components/workflow/types'

export type VariableAggregateNodeType = CommonNodeData & {
  groups: {
    name: string
    // groupId: string
    output_type: VarType // 存下，是因为vars要保持一致，但是在上游改变type导致vars类型不一致时，这个一致性就破坏了，因此存下 
    variables: ValueSelector[]
  }[]
}
