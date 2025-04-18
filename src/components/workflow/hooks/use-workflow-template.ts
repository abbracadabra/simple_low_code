import { generateNewNode } from '../utils'
import {
  NODE_WIDTH_X_OFFSET,
  START_INITIAL_POSITION,
} from '../constants'
import { useIsChatMode } from './use-workflow'
// import { useNodesInitialData } from './use-nodes-data'
import {
  NODES_INITIAL_DATA,
} from '../nodes/constants'

export const useWorkflowTemplate = () => {
  const isChatMode = useIsChatMode()
  // const nodesInitialData = useNodesInitialData()

  // 开始节点
  const { newNode: startNode } = generateNewNode({
    data: NODES_INITIAL_DATA.start,
    position: START_INITIAL_POSITION,
  })

  if (isChatMode) {
    // llm 节点
    const { newNode: llmNode } = generateNewNode({
      id: 'llm',
      data: {
        ...NODES_INITIAL_DATA.llm,
        memory: {
          window: { enabled: false, size: 10 },
          query_prompt_template: '{{#sys.query#}}',
        },
        selected: true,
      },
      position: {
        x: START_INITIAL_POSITION.x + NODE_WIDTH_X_OFFSET,
        y: START_INITIAL_POSITION.y,
      },
    } as any)

    // answer 节点
    const { newNode: answerNode } = generateNewNode({
      id: 'answer',
      data: {
        ...NODES_INITIAL_DATA.answer,
        answer: `{{#${llmNode.id}.text#}}`,
      },
      position: {
        x: START_INITIAL_POSITION.x + NODE_WIDTH_X_OFFSET * 2,
        y: START_INITIAL_POSITION.y,
      },
    } as any)

    // 起点到llm的边
    const startToLlmEdge = {
      id: `${startNode.id}-${llmNode.id}`,
      source: startNode.id,
      sourceHandle: 'source',
      target: llmNode.id,
      targetHandle: 'target',
    }

    // llm到answer的边
    const llmToAnswerEdge = {
      id: `${llmNode.id}-${answerNode.id}`,
      source: llmNode.id,
      sourceHandle: 'source',
      target: answerNode.id,
      targetHandle: 'target',
    }

    return {
      nodes: [startNode, llmNode, answerNode],
      edges: [startToLlmEdge, llmToAnswerEdge],
    }
  } else {
    return {
      nodes: [startNode],
      edges: [],
    }
  }
}
