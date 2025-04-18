// import type { Viewport } from 'reactflow'
import type {
  // ConversationVariable,
  Edge,
  // EnvironmentVariable,
  Node,
  VarWithConstVal,
} from '@/components/workflow/types'
 

export type FetchWorkflowDraftResponse = {
  // id: string
  graph: {
    nodes: Node[]
    edges: Edge[]
    // viewport?: Viewport
  }
  features?: any
  created_at: number
  // created_by: {
  //   id: string
  //   name: string
  //   email: string
  // }
  // hash: string
  updated_at: number
  // tool_published: boolean
  environment_variables?: VarWithConstVal[]
  conversation_variables?: VarWithConstVal[]
}
 