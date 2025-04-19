import { VarType } from '@/components/workflow/types';
import { isBlank } from '@/utils/strutils';
import { type NodeDefault, type PromptItem, PromptRole } from '../../types';
import { commonNextNodes, commonPrevNodes } from '../util';
import type { LLMNodeType } from './types';

// const i18nPrefix = 'workflow.errorMsg'

const nodeDefault: NodeDefault<LLMNodeType> = {
  defaultValue: {
    model: {
      // provider: '',
      name: '',
      // mode: 'chat',
      completion_params: {
        temperature: 0.7,
      },
    },
    fixed_template: [
      {
        role: PromptRole.system,
        text: '',
      },
    ],
    context: {
      enabled: false,
      variable_selector: [],
    },
    // vision: {
    //   enabled: false,
    // },
  },
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    return commonPrevNodes(chatMode, inIteration);
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    return commonNextNodes(chatMode, inIteration);
  },
  checkValid(payload: LLMNodeType) {
    let errorMessages = '';

    if (!errorMessages && !payload.model.name) errorMessages = '模型必填';

    if (!errorMessages) {
      // const isChatModel = payload.model.mode === 'chat'
      // const isPromptEmpty = (payload.fixed_template as PromptItem[]).every(
      //   (t) => {
      //     return isBlank(t.text);
      //   },
      // );
      // : (payload.prompt_template as PromptItem).text === ''
      if (isBlank(payload.userQuestion)) {
        errorMessages = '请输入prompt';
      } else if (!payload.userQuestion.includes('{{#sys.query#}}')) {
        errorMessages = "消息必须有'sys.query'变量";
      }
    }

    // if (!errorMessages && payload.memory) {
    //   if ((payload.prompt_template as PromptItem[])?.at(-1)?.role === PromptRole.user)
    //     errorMessages = '最后一条prompt消息必须是用户消息prompt'
    // }

    // if (!errorMessages && !!payload.memory) {
    //   const isChatModel = payload.model.mode === 'chat'
    //   // payload.memory.query_prompt_template not pass is default: {{#sys.query#}}
    //   if (isChatModel && !!payload.memory.query_prompt_template && !payload.memory.query_prompt_template.includes('{{#sys.query#}}'))
    //     errorMessages = 'user message 中必须包含 sys.query'
    // }

    // if (!errorMessages) {
    // const isChatModel = payload.model.mode === 'chat'
    // const isShowVars = (() => {
    //   if (isChatModel)
    //     return (payload.prompt_template as PromptItem[]).some(item => item.edition_type === EditionType.jinja2)
    //   return (payload.prompt_template as PromptItem).edition_type === EditionType.jinja2
    // })()
    // if (isShowVars && payload.prompt_config?.jinja2_variables) {
    //   payload.prompt_config?.jinja2_variables.forEach((i) => {
    //     if (!errorMessages && !i.variable)
    //       errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t(`${i18nPrefix}.fields.variable`) })
    //     if (!errorMessages && !i.value_selector.length)
    //       errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t(`${i18nPrefix}.fields.variableValue`) })
    //   })
    // }
    // }
    // if (!errorMessages && payload.vision?.enabled && !payload.vision.configs?.variable_selector?.length)
    //   errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t(`${i18nPrefix}.fields.visionVariable`) })
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    };
  },
  getOutputVars() {
    return [
      {
        name: 'text',
        type: VarType.string,
      },
    ];
  },
};

export default nodeDefault;
