import type { CommonNodeData, Memory, ModelConfig, PromptItem, ValueSelector } from '@/components/workflow/types'

// fixed prompt + chat history + user prompt
export type LLMNodeType = CommonNodeData & {
  model: ModelConfig
  prompt_template: PromptItem[] // setting, few shot
  // prompt_config?: {
  //   jinja2_variables?: Variable[]
  // }

  userQuestion: string // 用户问题
  memory?: Memory // 带历史消息 
  context: {
    enabled: boolean
    variable_selector: ValueSelector
  }
  // vision: {
  //   enabled: boolean
  //   configs?: VisionSetting
  // }
}
