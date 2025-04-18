import { type NodeDefault } from '../../types'
import { BlockEnum } from '../../types'
import { commonNextNodes, commonPrevNodes } from '../util'
import type { VariableAggregateNodeType } from './types'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'

const nodeDefault: NodeDefault<VariableAggregateNodeType> = {
  defaultValue: {
    groups: [],
  },
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    return commonPrevNodes(chatMode, inIteration)
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    return commonNextNodes(chatMode, inIteration)
  },
  checkValid(payload: VariableAggregateNodeType) {
    let errorMessages = ''
    const { groups } = payload
    if (!groups || groups.length === 0)
      errorMessages = '请输入聚合变量'
    if (!errorMessages) {
      groups.forEach(({variables}) => {
        if (!variables || variables.length === 0)
          errorMessages = '请输入要聚合的变量'
      })
    }
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
  getOutputVars(payload: VariableAggregateNodeType) {
    return payload.groups.map((group) => {
      return {
        name: group.name,
        type: group.output_type,
      }
    })
  }
}

export default nodeDefault
