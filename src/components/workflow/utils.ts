/* eslint-disable @typescript-eslint/no-use-before-define */
import type {
    Node,
  } from './types'
  import {
    Edge,
    BlockEnum,
    NodeRunningStatus,
  } from './types'
  import {
    COMMON_NODE,
    ITERATION_CHILDREN_Z_INDEX,
    ITERATION_NODE_Z_INDEX,
  } from './constants'
  import { CUSTOM_ITERATION_START_NODE } from './nodes/iteration-start/constants'
  import type { IterationNodeType } from './nodes/iteration/types'
  import {
    Position,
  } from 'reactflow'
  // import type { IfElseNodeType } from './nodes/if-else/types'
  // import { getBranchName } from './nodes/if-else/utils'
  // import type { QuestionClassifierNodeType } from './nodes/question-classifier/types'


const WHITE = 'WHITE'
const GRAY = 'GRAY'
const BLACK = 'BLACK'

const isCyclicUtil = (nodeId: string, color: Record<string, string>, adjList: Record<string, string[]>, stack: string[]) => {
  color[nodeId] = GRAY
  stack.push(nodeId)

  for (let i = 0; i < adjList[nodeId].length; ++i) {
    const childId = adjList[nodeId][i]

    if (color[childId] === GRAY) {
      stack.push(childId)
      return true
    }
    if (color[childId] === WHITE && isCyclicUtil(childId, color, adjList, stack))
      return true
  }
  color[nodeId] = BLACK
  if (stack.length > 0 && stack[stack.length - 1] === nodeId)
    stack.pop()
  return false
}

const getCycleEdges = (nodes: Node[], edges: Edge[]) => {
  const adjList: Record<string, string[]> = {}
  const color: Record<string, string> = {}
  const stack: string[] = []

  for (const node of nodes) {
    color[node.id] = WHITE
    adjList[node.id] = []
  }

  for (const edge of edges)
    adjList[edge.source]?.push(edge.target)

  for (let i = 0; i < nodes.length; i++) {
    if (color[nodes[i].id] === WHITE)
      isCyclicUtil(nodes[i].id, color, adjList, stack)
  }

  const cycleEdges = []
  if (stack.length > 0) {
    const cycleNodes = new Set(stack)
    for (const edge of edges) {
      if (cycleNodes.has(edge.source) && cycleNodes.has(edge.target))
        cycleEdges.push(edge)
    }
  }

  return cycleEdges
}

// 创建迭代节点时创建一个迭代起点节点，type特殊
export function getIterationStartNode(iterationId: string): Node {
  return generateNewNode({
    id: `${iterationId}start`,
    type: CUSTOM_ITERATION_START_NODE, // 没有title，没有左handle，不打开panel，所以搞个特殊类型，特殊渲染
    data: {
      title: '', // 就一个home icon，不需要title、desc
      desc: '', // 就一个home icon，不需要title、desc
      type: BlockEnum.IterationStart,
      isInIteration: true,
    },
    position: {
      x: 24,
      y: 68,
    },
    zIndex: ITERATION_CHILDREN_Z_INDEX,
    parentId: iterationId,
    selectable: false, // 不可选择
    draggable: false,
  }).newNode
}

  export function generateNewNode({ data, position, id, zIndex, type, ...rest }: Omit<Node, 'id'> & { id?: string }): {
    newNode: Node
    newIterationStartNode?: Node
  } {
    const newNode = {
      id: id || `${Date.now()}`,
      type: type || COMMON_NODE,
      data,
      position,
      targetPosition: Position.Left, // 线target位置，在节点左侧
      sourcePosition: Position.Right, // 线src位置，在节点右侧
      zIndex: data.type === BlockEnum.Iteration ? ITERATION_NODE_Z_INDEX : zIndex,
      ...rest,
    } as Node
  
    if (data.type === BlockEnum.Iteration) {
      const newIterationStartNode = getIterationStartNode(newNode.id); // 长得像home房子的固定节点
      newIterationStartNode.parentId = newNode.id; // 迭代里的开始节点设置parent为迭代节点
      (newNode.data as IterationNodeType).start_node_id = newIterationStartNode.id; // 迭代节点的开始节点id设置为迭代开始节点
      // (newNode.data as IterationNodeType)._children = [newIterationStartNode.id]
      return {
        newNode,
        newIterationStartNode,
      }
    }
  
    return {
      newNode,
    }
  }

  // 这里的source和handle是edge的source和target
// export const getNodesConnectedSourceOrTargetHandleIdsMap = (changes: ConnectedSourceOrTargetNodesChange, nodes: Node[]) => {
//     const nodesConnectedSourceOrTargetHandleIdsMap = {} as Record<string, any>
  
//     changes.forEach((change) => {
//       const {
//         edge,
//         type,
//       } = change
//       const sourceNode = nodes.find(node => node.id === edge.source)!
//       if (sourceNode) {
//         nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id] = nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id] || {
//           // _connectedSourceHandleIds: [...(sourceNode?.data._connectedSourceHandleIds || [])],
//           // _connectedTargetHandleIds: [...(sourceNode?.data._connectedTargetHandleIds || [])],
//         }
//       }
  
//       const targetNode = nodes.find(node => node.id === edge.target)!
//       if (targetNode) {
//         nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id] = nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id] || {
//           // _connectedSourceHandleIds: [...(targetNode?.data._connectedSourceHandleIds || [])],
//           // _connectedTargetHandleIds: [...(targetNode?.data._connectedTargetHandleIds || [])],
//         }
//       }
  
//       if (sourceNode) {
//         if (type === 'remove') {
//           // const index = nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id]._connectedSourceHandleIds.findIndex((handleId: string) => handleId === edge.sourceHandle) // node的source handle id的idx
//           // nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id]._connectedSourceHandleIds.splice(index, 1) // 删
//         }
  
//         // if (type === 'add')
//         //   nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id]._connectedSourceHandleIds.push(edge.sourceHandle || 'source')
//       }
  
//       if (targetNode) {
//         if (type === 'remove') {
//           // const index = nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id]._connectedTargetHandleIds.findIndex((handleId: string) => handleId === edge.targetHandle)
//           // nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id]._connectedTargetHandleIds.splice(index, 1)
//         }
  
//         // if (type === 'add')
//           // nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id]._connectedTargetHandleIds.push(edge.targetHandle || 'target')
//       }
//     })
  
//     return nodesConnectedSourceOrTargetHandleIdsMap
//   }


  export const genNewNodeTitleFromOld = (oldTitle: string) => {
    const regex = /^(.+?)\s*\((\d+)\)\s*$/ // 标题(数字)
    const match = oldTitle.match(regex)
  
    if (match) {
      const title = match[1]
      const num = parseInt(match[2], 10)
      return `${title} (${num + 1})`
    }
    else {
      return `${oldTitle} (1)`
    }
  }


  export const getTopLeftNodePosition = (nodes: Node[]) => {
    let minX = Infinity
    let minY = Infinity
  
    nodes.forEach((node) => {
      if (node.position.x < minX)
        minX = node.position.x
  
      if (node.position.y < minY)
        minY = node.position.y
    })
  
    return {
      x: minX,
      y: minY,
    }
  }

  // export const getEdgeColor = (nodeRunningStatus?: NodeRunningStatus, isFailBranch?: boolean) => {
  export const getEdgeColor = (nodeRunningStatus?: NodeRunningStatus) => {
    if (nodeRunningStatus === NodeRunningStatus.Succeeded)
      return 'var(--color-workflow-link-line-success-handle)'
  
    if (nodeRunningStatus === NodeRunningStatus.Failed)
      return 'var(--color-workflow-link-line-error-handle)'
  
    if (nodeRunningStatus === NodeRunningStatus.Exception)
      return 'var(--color-workflow-link-line-failure-handle)'
  
    if (nodeRunningStatus === NodeRunningStatus.Running) {
      // if (isFailBranch)
      //   return 'var(--color-workflow-link-line-failure-handle)'
  
      return 'var(--color-workflow-link-line-handle)'
    }
  
    return 'var(--color-workflow-link-line-normal)'
  }

  export const initialNodes = (originNodes: Node[], originEdges: Edge[]) => {
    const nodes = originNodes
    // const { nodes, edges } = preprocessNodesAndEdges(cloneDeep(originNodes), cloneDeep(originEdges)) // 能去掉
    // const firstNode = nodes[0]
  
    // if (!firstNode?.position) { // 如果缺pos，则写上，能去掉
    //   nodes.forEach((node, index) => {
    //     node.position = {
    //       x: START_INITIAL_POSITION.x + index * NODE_WIDTH_X_OFFSET,
    //       y: START_INITIAL_POSITION.y,
    //     }
    //   })
    // }
  
    // const iterationNodeMap = nodes.reduce((acc, node) => { // 迭代节点，及它的children
    //   if (node.parentId) {
    //     if (acc[node.parentId])
    //       acc[node.parentId].push(node.id)
    //     else
    //       acc[node.parentId] = [node.id]
    //   }
    //   return acc
    // }, {} as Record<string, string[]>)
  
    return nodes.map((node) => {
      // if (!node.type)
      //   node.type = CUSTOM_NODE // 填充缺失的字段，可去掉
  
      // const connectedEdges = getConnectedEdges([node], edges) // 删
      // node.data._connectedSourceHandleIds = connectedEdges.filter(edge => edge.source === node.id).map(edge => edge.sourceHandle || 'source') // 删
      // node.data._connectedTargetHandleIds = connectedEdges.filter(edge => edge.target === node.id).map(edge => edge.targetHandle || 'target') // 删
  
      // if (node.data.type === BlockEnum.IfElse) {
      //   // const nodeData = node.data as IfElseNodeType
  
      //   // if (!nodeData.cases && nodeData.logical_operator && nodeData.conditions) { // 删，应该是修历史数据
      //   //   (node.data as IfElseNodeType).cases = [
      //   //     {
      //   //       case_id: 'true',
      //   //       logical_operator: nodeData.logical_operator,
      //   //       conditions: nodeData.conditions,
      //   //     },
      //   //   ]
      //   // }
      //   node.data._targetBranches = getBranchName(
      //     (node.data as IfElseNodeType).cases.map(item => item.case_id),
      //     // { id: 'false', name: '' },
      //   )// 通用结构，handleids，if else时等于caseids
      // }
  
      // if (node.data.type === BlockEnum.QuestionClassifier) {
      //   node.data._targetBranches = (node.data as QuestionClassifierNodeType).classes.map((id, index) => {
      //     return { id: id, name: '分类'+(index+1) }
      //   })
      // }
  
      if (node.data.type === BlockEnum.Iteration) {
        const iterationNodeData = node.data as IterationNodeType
        // iterationNodeData._children = iterationNodeMap[node.id] || []
        iterationNodeData.is_parallel = iterationNodeData.is_parallel || false // 列表元素for循环是否并行多个loop
        iterationNodeData.parallel_nums = iterationNodeData.parallel_nums || 10 // 并行数，多少个loop
        // iterationNodeData.error_handle_mode = iterationNodeData.error_handle_mode || ErrorHandleMode.Terminated
      }
  
      // if (node.data.type === BlockEnum.HttpRequest && !node.data.retry_config) {
      //   node.data.retry_config = {
      //     retry_enabled: true,
      //     max_retries: DEFAULT_RETRY_MAX,
      //     retry_interval: DEFAULT_RETRY_INTERVAL,
      //   }
      // }
  
      return node
    })
  }

  export const initialEdges = (originEdges: Edge[], originNodes: Node[]) => {
    // const { nodes, edges } = preprocessNodesAndEdges(cloneDeep(originNodes), cloneDeep(originEdges))
    const nodes = originNodes
    const edges = originEdges
    // let selectedNode: Node | null = null
    // const nodesMap = nodes.reduce((acc, node) => {
    //   acc[node.id] = node
  
    //   if (node.data?.selected)
    //     selectedNode = node
  
    //   return acc
    // }, {} as Record<string, Node>)
  
    const cycleEdges = getCycleEdges(nodes, edges) // edge环，其实这个可以删掉，因为每次连接时isValidConnection方法会检测环
    return edges.filter((edge) => {
      return !cycleEdges.find(cycEdge => cycEdge.source === edge.source && cycEdge.target === edge.target)
    })
    // .map((edge) => {
      // edge.type = 'custom'
  
      // if (!edge.sourceHandle)
      //   edge.sourceHandle = 'source'
  
      // if (!edge.targetHandle)
      //   edge.targetHandle = 'target'
  
      // if (!edge.data?.sourceType && edge.source && nodesMap[edge.source]) {
      //   edge.data = {
      //     ...edge.data,
      //     sourceType: nodesMap[edge.source].data.type!, // 填充缺失的data.sourceType
      //   } as any
      // }
  
      // if (!edge.data?.targetType && edge.target && nodesMap[edge.target]) {
      //   edge.data = {
      //     ...edge.data,
      //     targetType: nodesMap[edge.target].data.type!, // 填充缺失的data.targetType
      //   } as any
      // }
  
      // if (selectedNode) {
      //   edge.data = {
      //     ...edge.data,
      //     _connectedNodeIsSelected: edge.source === selectedNode.id || edge.target === selectedNode.id,//??
      //   } as any
      // }
  
      // return edge
    // })
  }

  export const isMac = () => {
    return navigator.userAgent.toUpperCase().includes('MAC')
  }

  const specialKeysCodeMap: Record<string, string | undefined> = {
    ctrl: 'meta',
  }

  export const getKeyboardKeyCodeBySystem = (key: string) => {
    if (isMac())
      return specialKeysCodeMap[key] || key
  
    return key
  }

  export const isEventTargetInputArea = (target: HTMLElement) => {
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      return true
  
    if (target.contentEditable === 'true')
      return true
  }