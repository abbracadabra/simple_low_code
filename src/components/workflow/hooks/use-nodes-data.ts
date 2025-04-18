import { BlockEnum, CommonNodeData } from '../types'
import { useCallback, useMemo } from 'react'
import { useIsChatMode } from './use-workflow'
import {
    NODES_EXTRA_INFO,
  } from '../nodes/constants'
import { useStoreApi } from 'reactflow'

// export const useValidNodesMap = () => {
//   const isChatMode = useIsChatMode()

//   return useMemo(() => Object.fromEntries(
//     Object.entries(NODES_EXTRA_INFO).map(([key, value]) => [key, {
//       ...value,
//       validPrevNodes: value.getValidPrevNodes(isChatMode), // 选择器可选的节点
//       validNextNodes: value.getValidNextNodes(isChatMode), // 选择器可选的节点
//     }])
//   ), [isChatMode]) 
// }

/**
 * 
 * @param nodeType 点击连接点的加号弹出的节点选择器里的可选节点，从下方加号nodetype=start
 * @param isInIteration 迭代内的节点
 */
export const useValidBlocks = (nodeType?: BlockEnum, isInIteration: boolean = false) => {
  const isChatMode = useIsChatMode()
  return useMemo(() => {
    if (!nodeType) {
      return {validPrevBlocks:[],validNextBlocks:[]}
    }
    return {
      validPrevBlocks: NODES_EXTRA_INFO[nodeType].getValidPrevNodes(isChatMode, isInIteration),
      validNextBlocks: NODES_EXTRA_INFO[nodeType].getValidNextNodes(isChatMode, isInIteration),
    }
  }, [nodeType, isInIteration])
}

export const useNodeTitle = () => {
  const store = useStoreApi()
  const {
    getNodes,
  } = store.getState()

  const getNodeTitle = useCallback((nodeId: string)=>{
    if (!nodeId) {
      return 'unknown'
    }
    if (nodeId === 'sys') {
      return '系统'
    }
    if (nodeId === 'env') {
      return '环境'
    }
    if (nodeId === 'conv') {
      return '会话'
    }
    const nd = getNodes().find(node => node.id === nodeId)
    if (!nd) {
      return 'unknown'
    }
    return (nd.data as CommonNodeData).title
  },[getNodes])

  return { getNodeTitle }
}