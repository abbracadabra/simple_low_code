import { useCallback } from 'react';
// import produce from 'immer'
import { useTranslation } from 'react-i18next'
import { useStoreApi } from 'reactflow'
import {
    ITERATION_PADDING,
} from '../../constants'
import {
  NODES_INITIAL_DATA,
} from '../../nodes/constants'
import { generateNewNode } from '../../utils'
import type { BlockEnum, Node } from '../../types';
import { CUSTOM_ITERATION_START_NODE } from '../iteration-start/constants'


export const useNodeIterationInteractions = () => {
  const { t } = useTranslation();
  const store = useStoreApi();

  // 迭代内节点的位置限制，不是迭代内节点返回undefined
  const handleNodeIterationChildDrag = useCallback(
    (node: Node) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();

      const restrictPosition: { x?: number; y?: number } = {
        x: undefined,
        y: undefined,
      };

      if (node.data.isInIteration) {
        const parentNode = nodes.find((n) => n.id === node.parentId);

        if (parentNode) {
          if (node.position.y < ITERATION_PADDING.top)
            restrictPosition.y = ITERATION_PADDING.top;
          if (node.position.x < ITERATION_PADDING.left)
            restrictPosition.x = ITERATION_PADDING.left;
          if (
            node.position.x + node.width! >
            parentNode!.width! - ITERATION_PADDING.right
          )
            restrictPosition.x =
              parentNode!.width! - ITERATION_PADDING.right - node.width!;
          if (
            node.position.y + node.height! >
            parentNode!.height! - ITERATION_PADDING.bottom
          )
            restrictPosition.y =
              parentNode!.height! - ITERATION_PADDING.bottom - node.height!;
        }
      }

      return {
        restrictPosition,
      };
    },
    [store],
  );

  const handleNodeIterationChildrenCopy = useCallback((nodeId: string, newNodeId: string) => {
    const { getNodes } = store.getState()
    const nodes = getNodes()
    const childrenNodes = nodes.filter(n => n.parentId === nodeId && n.type !== CUSTOM_ITERATION_START_NODE) // 迭代节点内的节点,排除迭代起始节点

    return childrenNodes.map((child, index) => {
      const childNodeType = child.data.type as BlockEnum
      const nodesWithSameType = nodes.filter(node => node.data.type === childNodeType)
      const { newNode } = generateNewNode({
        data: {
          ...NODES_INITIAL_DATA[childNodeType],
          ...child.data,
          selected: false,
          _isBundled: false,
          // _connectedSourceHandleIds: [],
          // _connectedTargetHandleIds: [],
          title: nodesWithSameType.length > 0 ? `${t(`workflow.blocks.${childNodeType}`)} ${nodesWithSameType.length + 1}` : t(`workflow.blocks.${childNodeType}`),
          iteration_id: newNodeId,
        },
        position: child.position,
        positionAbsolute: child.positionAbsolute,
        parentId: newNodeId,
        extent: child.extent,
        zIndex: child.zIndex,
      })
      newNode.id = `${newNodeId}${newNode.id + index}`
      return newNode
    })
  }, [store, t])

  return {
    // handleNodeIterationRerender,
    handleNodeIterationChildDrag,
    // handleNodeIterationChildSizeChange,
    handleNodeIterationChildrenCopy,
  };
};

 