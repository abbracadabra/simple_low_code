import { BlockEnum, type NodeDefault } from '../../types'
import { type IfElseNodeType } from './types'
// import { isEmptyRelatedOperator } from './utils'
// import { TransferMethod } from '@/types/app'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'
import { valueLessOperator } from './utils'
import { commonNextNodes, commonPrevNodes } from '../util'

// const i18nPrefix = 'workflow.errorMsg'

const nodeDefault: NodeDefault<IfElseNodeType> = {
  defaultValue: {
    // _targetBranches: [
    //   {
    //     id: 'true',
    //     name: 'IF',
    //   },
    //   {
    //     id: 'false',
    //     name: 'ELSE',
    //   },
    // ],
    cases: [
      {
        case_id: 'true'
        // logical_operator: LogicalOperator.and,
        // condition: [],
      },
    ],
  },
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    return commonPrevNodes(chatMode, inIteration)
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    return commonNextNodes(chatMode, inIteration)
  },
  checkValid(payload: IfElseNodeType) {
    let errorMessages = ''
    const { cases } = payload
    if (!cases || cases.length === 0)
      errorMessages = '请输入分支'

    cases.forEach((caseItem, index) => {
      // if (!caseItem.condition)
      //   errorMessages = '请添加条件'

      // const condition = caseItem.condition
      // caseItem.conditions.forEach((condition) => {
      if (!errorMessages && (!caseItem.variable_selector || caseItem.variable_selector.length === 0))
        errorMessages = '请选择条件的变量'
      if (!errorMessages && !caseItem.comparison_operator)
        errorMessages = '请填写条件符号'
      if (!errorMessages) {
        if (!valueLessOperator(caseItem.comparison_operator!) && !caseItem.value)
          errorMessages = '请填写条件值'
      }
    })
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault

// export const FILE_TYPE_OPTIONS = [
//   { value: 'image', i18nKey: 'image' },
//   { value: 'document', i18nKey: 'doc' },
//   { value: 'audio', i18nKey: 'audio' },
//   { value: 'video', i18nKey: 'video' },
// ]

// export const TRANSFER_METHOD = [
//   { value: TransferMethod.local_file, i18nKey: 'localUpload' },
//   { value: TransferMethod.remote_url, i18nKey: 'url' },
// ]

// export const SUB_VARIABLES = ['type', 'size', 'name', 'url', 'extension', 'mime_type', 'transfer_method']
// export const OUTPUT_FILE_SUB_VARIABLES = SUB_VARIABLES.filter(key => key !== 'transfer_method')
