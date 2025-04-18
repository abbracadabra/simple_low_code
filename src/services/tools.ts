import type { Tool } from '@/components/tools/types'
import { VarType } from '@/components/workflow/types'

// 获取所有工具
export const fetchAllTools = () => {
  const mock: Tool[] = [
    {
      name: 'LLM Chat',
      description: 'LLM Chat',
      label: 'LLM Chat',
      icon: 'LLM',
      parameters: [
        {
          name: 'model',
          type: VarType.string,
          desc: 'LLM Model',
          required: true,
          // default: 'gpt-3.5-turbo',
        }
      ],
      outputVars: [
        {
          name: 'output',
          desc: '输出',
          type: VarType.string,
        }
      ]

    }
  ]
  return Promise.resolve(mock)
    // return get<Tool[]>('/workspaces/current/tools/builtin')
  }