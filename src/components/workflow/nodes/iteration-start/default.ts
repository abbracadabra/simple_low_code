import { BlockEnum, type NodeDefault } from '../../types'
// import type { IterationStartNodeType } from './types'
import type { CommonNodeData } from '@/components/workflow/types'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'
import { commonNextNodes } from '../util'

const nodeDefault: NodeDefault<CommonNodeData> = {
  defaultValue: {},
  getValidPrevNodes() {
    return []
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    if (!inIteration) {
      return []
    }
    return commonNextNodes(chatMode, inIteration)
  },
  checkValid() {
    return {
      isValid: true,
    }
  },
}

export default nodeDefault
