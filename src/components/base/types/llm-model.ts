
export type LLMModel = {
    name: string
    model_type: ModelTypeEnum
    features?: ModelFeatureEnum[]
    model_properties: Record<string, string | number>
  }

  export enum ModelTypeEnum {
    textGeneration = 'llm',
    textEmbedding = 'text-embedding',
    rerank = 'rerank',
    speech2text = 'speech2text',
    moderation = 'moderation',
    tts = 'tts',
  }

  export enum ModelFeatureEnum {
    toolCall = 'tool-call',
    multiToolCall = 'multi-tool-call',
    agentThought = 'agent-thought',
    vision = 'vision',
    video = 'video',
    document = 'document',
    audio = 'audio',
  }