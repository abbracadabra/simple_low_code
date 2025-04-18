import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import type { IterationNodeType } from './types'
import { VarType } from '@/components/workflow/types'
import {
  ALL_CHAT_BLOCKS,
  ALL_COMPLETION_BLOCKS,
} from '@/components/workflow/constants'
import { commonNextNodes, commonPrevNodes } from '../util'
// const i18nPrefix = 'workflow'

const nodeDefault: NodeDefault<IterationNodeType> = {
  defaultValue: {
    start_node_id: '',
    iterator_selector: [],
    output_selector: [],
    // _children: [],
    // _isShowTips: false,
    is_parallel: false,
    parallel_nums: 10,
    // error_handle_mode: ErrorHandleMode.Terminated,
  },
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    if (inIteration) {
      return []
    }
    return commonPrevNodes(chatMode, inIteration)
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    if (inIteration) {
      return []
    }
    return commonNextNodes(chatMode, inIteration)
  },
  checkValid(payload: IterationNodeType) {
    let errorMessages = ''

    if (
      !errorMessages
      && (!payload.iterator_selector || payload.iterator_selector.length === 0)
    ) {
      errorMessages = '请选择迭代的输入值'
    }

    if (
      !errorMessages
      && (!payload.output_selector || payload.output_selector.length === 0)
    ) {
      errorMessages = '请选择迭代的输出值'
    }

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
  getOutputVars(payload: IterationNodeType) {
    return [
      {
        name: 'output',
        type: payload.output_type || VarType.arrayString,
      },
    ]
  },
}

export default nodeDefault
