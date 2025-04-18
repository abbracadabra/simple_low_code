import type { CommonNodeData, SimpleVarSchema } from '@/components/workflow/types'

export type StartNodeType = CommonNodeData & {
  variables: SimpleVarSchema[]
}
