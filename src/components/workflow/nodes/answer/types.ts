import type { CommonNodeData } from '@/components/workflow/types'

export type AnswerNodeType = CommonNodeData & {
  // variables: Variable[]
  answer: string
}
