import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import { commonNextNodes, commonPrevNodes } from '../util'
import { CodeLanguage, type CodeNodeType } from './types'
import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'

// const i18nPrefix = 'workflow.errorMsg'

// const nodeDefault: NodeDefault<CodeNodeType> = {
const nodeDefault: NodeDefault<CodeNodeType> = {
  defaultValue: {
    code: '',
    code_language: CodeLanguage.python3,
    variables: [],
    outputs: [],
  } as Partial<CodeNodeType>,
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    return commonPrevNodes(chatMode, inIteration)
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    return commonNextNodes(chatMode, inIteration)
  },
  checkValid(payload: CodeNodeType) {
    let errorMessages = ''
    const { code, variables } = payload
    if (!errorMessages && variables.filter(v => !v.name).length > 0)
      errorMessages = '请输入入参名'
    if (!errorMessages && variables.filter(v => !v.value_selector.length).length > 0)
      errorMessages = '请输入入参值'
    if (!errorMessages && !code)
      errorMessages = '请输入代码'

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
  getOutputVars(payload: CodeNodeType) {
    const {
      outputs,
    } = payload
    return outputs
      ? Object.keys(outputs).map((key) => {
        return {
          name: key,
          type: outputs[key].type,
        }
      })
      : []
  }
}

export default nodeDefault
