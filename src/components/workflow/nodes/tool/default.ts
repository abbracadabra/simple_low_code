// import { BlockEnum } from '../../types'
import constStore from '@/components/base/system-config-store';
import { Tool } from '@/components/tools/types';
import type { NodeDefault, SimpleVarSchema } from '../../types';
import { commonNextNodes, commonPrevNodes } from '../util';
import type { ToolNodeType } from './types';
// import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from '@/components/workflow/constants'

/**
 * i.e.,http,soa
 */
const nodeDefault: NodeDefault<ToolNodeType> = {
  defaultValue: {
    tool_parameters: {},
    // tool_configurations: {},
  },
  getValidPrevNodes(chatMode: boolean, inIteration: boolean) {
    return commonPrevNodes(chatMode, inIteration);
  },
  getValidNextNodes(chatMode: boolean, inIteration: boolean) {
    return commonNextNodes(chatMode, inIteration);
  },
  checkValid(payload: ToolNodeType, moreDataForCheckValid: any) {
    const { toolInputsSchema } = moreDataForCheckValid;
    let errorMessages = '';
    // if (notAuthed)
    // errorMessages = t(`${i18nPrefix}.authRequired`)

    if (!errorMessages) {
      // 必填arg参数校验
      toolInputsSchema
        .filter((field: any) => {
          return field.required;
        })
        .forEach((field: any) => {
          const val = payload.tool_parameters[field.variable];
          // const val = targetVar?.value;
          if (val === undefined || val === null || val.length === 0) {
            errorMessages = '入参信息缺失：' + field.label;
          }
        });
    }
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    };
  },
  getOutputVars(payload: ToolNodeType) {
    // 在使用处要selector这个allTools以便刷新组件
    const tools = constStore.getState().allTools;
    const tool = tools.find((tool: Tool) => tool.name === payload.tool_name);
    return (
      tool?.outputVars?.map((outputVar: SimpleVarSchema) => ({
        name: outputVar.name,
        type: outputVar.type,
      })) || []
    );
  },
};

export default nodeDefault;
