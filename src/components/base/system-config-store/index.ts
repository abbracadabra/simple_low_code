import { create } from 'zustand'
import { LLMModel } from '@/components/base/types/llm-model'
import { fetchAllModels } from '@/services/llm-model';
import { Tool } from '@/components/tools/types';
import { fetchAllTools } from '@/services/tools';

// 在一些地方需要调initfetchModes，dify在ProviderContextProvider
type Store = {
    llmModels: LLMModel[];
    allTools: Tool[]
    fetchModels: () => void;
    fetchAllTools: () => void
}

const storeApi = create<Store>((set) => ({
    llmModels: [],
    // setModels: (models: LLMModel[]) => set(() => ({ llmModels: models })),
    fetchModels: async () => {
        const res = await fetchAllModels()
        if (res) {
            set(() => ({ llmModels: res }))
        }
    },
    allTools: [],
    // setAllTools: customTools => set(() => ({ allTools: customTools }))
    fetchAllTools: async ()=>{
        const res = await fetchAllTools()
        if (res) {
            set(() => ({ allTools: res }))
        }
      }
}));

export default storeApi;