import { BlockEnum, SimpleVarSchema, VarType } from './types'

// export const CUSTOM_NODE = 'custom'
// export const CUSTOM_EDGE = 'custom'
export const COMMON_NODE = 'common'
export const COMMON_EDGE = 'common'

//在选择器里可选的节点. for specific node, subset this list 
export const ALL_CHAT_BLOCKS = Object.values(BlockEnum).filter(v => v !== BlockEnum.End) as BlockEnum[]
//在选择器里可选的节点. for specific node, subset this list
export const ALL_COMPLETION_BLOCKS = Object.values(BlockEnum).filter(v => v !== BlockEnum.Answer && v !== BlockEnum.Assigner) as BlockEnum[]

export const NODE_WIDTH = 240
export const X_OFFSET = 60
export const NODE_WIDTH_X_OFFSET = NODE_WIDTH + X_OFFSET
export const Y_OFFSET = 39
export const START_INITIAL_POSITION = { x: 80, y: 282 }

// 防止child与iter node重叠
export const ITERATION_PADDING = {
  top: 65,
  right: 16, 
  bottom: 20,
  left: 16,
}

export const ITERATION_CHILDREN_Z_INDEX = 1002
export const ITERATION_NODE_Z_INDEX = 1


export const SUPPORT_OUTPUT_VARS_NODE = [
  BlockEnum.Start, BlockEnum.LLM, BlockEnum.Code, BlockEnum.Tool, BlockEnum.VariableAggregator, BlockEnum.Iteration,
]

export const ChatSysVars:SimpleVarSchema[] = [{name:'query',type: VarType.string},{name:'user_id',type: VarType.string},{name:'app_id',type: VarType.string}]
export const SysVars:SimpleVarSchema[] = [{name:'app_id',type: VarType.string}]