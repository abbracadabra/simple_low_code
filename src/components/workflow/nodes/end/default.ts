// import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import { commonPrevNodes } from '../util'
import { type EndNodeType } from './types'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'

const nodeDefault: NodeDefault<EndNodeType> = {
  defaultValue: {
    outputs: [],
  },
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    if (chatMode) {
      return []
    }
    return commonPrevNodes(chatMode, inIteration)
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    return []
  },
  checkValid(payload: EndNodeType) {
    let isValid = true
    let errorMessages = ''
    const hasMissing = payload.outputs.some(output => {
      return !output.value_selector?.length
    })
    if (hasMissing) {
      isValid = false
      errorMessages = 'Outputs must have a value selector'
    }
    return {
      isValid,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
