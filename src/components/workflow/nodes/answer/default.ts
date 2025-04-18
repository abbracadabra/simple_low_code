import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import { commonNextNodes, commonPrevNodes } from '../util'
import type { AnswerNodeType } from './types'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'

// const nodeDefault: NodeDefault<AnswerNodeType> = {
const nodeDefault: NodeDefault<AnswerNodeType> = {
  defaultValue: {
    variables: [],
    answer: '',
  } as Partial<AnswerNodeType>,
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    if (!chatMode) {
      return []
    }
    return commonPrevNodes(chatMode, inIteration)
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    if (!chatMode) {
      return []
    }
    return commonNextNodes(chatMode, inIteration)
  },
  checkValid(payload: AnswerNodeType) {
    let errorMessages = ''
    const { answer } = payload
    if (!answer)
      errorMessages = '请填写回答内容'

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
