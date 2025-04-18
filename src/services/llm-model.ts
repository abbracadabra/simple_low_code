import { LLMModel, ModelTypeEnum } from '@/components/base/types/llm-model';

// 获取所有模型
export const fetchAllModels = () => {
  return Promise.resolve([
    {
      name: 'myLLm',
      model_type: ModelTypeEnum.textGeneration,
    },
  ] as LLMModel[]);
  // return get<LLMModel[]>('/workspaces/current/tools/builtin')
};
