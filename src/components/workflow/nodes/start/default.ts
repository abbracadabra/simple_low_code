import { BlockEnum, type NodeDefault } from '../../types'
import { commonNextNodes } from '../util'
import type { StartNodeType } from './types'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'

const nodeDefault: NodeDefault<StartNodeType> = {
  defaultValue: {
    variables: [],
  },
  getValidPrevNodes() {
    return []
  },
  getValidNextNodes(isChatMode: boolean, isInIteration: boolean) {
    if (isInIteration) {
      return []
    }
    return commonNextNodes(isChatMode, isInIteration)
  },
  checkValid() {
    return {
      isValid: true,
    }
  },
  getOutputVars(payload: StartNodeType) {
    const {
        variables,
      } = payload
    return variables.map((v) => {
      return {
        name: v.name,
        type: v.type,
      }
    })
  }
}

export default nodeDefault
