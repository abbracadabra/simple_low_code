import { BlockEnum } from '../types'
import { useMemo } from 'react'
import { useIsChatMode } from './use-workflow'
import {
    NODES_EXTRA_INFO,
  } from '../nodes/constants'

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
  