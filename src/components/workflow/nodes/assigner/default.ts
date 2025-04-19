import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import { isConversationVar } from '../node-base/components/variable/utils'
import { commonNextNodes, commonPrevNodes } from '../util'
import { WriteMode, type AssignerNodeType } from './types'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'

const nodeDefault: NodeDefault<AssignerNodeType> = {
  defaultValue: {
    items: [],
  },
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
  checkValid(payload: AssignerNodeType) {
    let errorMessages = ''
    const {
      items: operationItems,
    } = payload

    operationItems?.forEach((item) => {
      if (!errorMessages && !item.varToBeAssigned?.length)
        errorMessages = '请选择会话变量'

      if (!errorMessages && !isConversationVar(item.varToBeAssigned)) {
        errorMessages = '您选择的不是会话变量'
      }
      if (!errorMessages && item.operation !== WriteMode.clear) {
        // if (item.value === undefined || item.value === null || item.value === '') {
        //   errorMessages = '请填写会话变量的值'
        // }
        if (!errorMessages && !item.value?.length) {
          errorMessages = '请填写会话变量的值'
        }

        // if (value.operation === WriteMode.set || value.operation === WriteMode.increment
        //   || value.operation === WriteMode.decrement || value.operation === WriteMode.multiply
        //   || value.operation === WriteMode.divide) {
        //   if (!value.value && typeof value.value !== 'number')
        //     errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t('workflow.nodes.assigner.variable') })
        // }
        // else if (!value.value?.length) {
        //   errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t('workflow.nodes.assigner.variable') })
        // }
      }
    })

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
