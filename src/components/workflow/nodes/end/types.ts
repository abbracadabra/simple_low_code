import type { CommonNodeData, VarWithSelector } from '@/components/workflow/types'

export type EndNodeType = CommonNodeData & {
  outputs: VarWithSelector[]
}
