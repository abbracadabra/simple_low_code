import modelStore from '@/components/base/system-config-store';
import { WorkflowDraftStoreContext } from '@/components/workflow/context';
// import {
//   isSystemVar,
// } from '@/components/workflow/nodes/node-base/components/variable/utils';
import {
  BlockEnum,
  CommonNodeData,
  NodeOutputVar,
  VarType,
  VarWithConstVal,
  VarWithSelector,
  // VarWithConstVal,
  type Node,
  type ValueSelector,
} from '@/components/workflow/types';
import { useCallback, useContext, useMemo } from 'react';
import { useStore } from 'zustand';
import { useIsChatMode, useNodeInfo, useWorkflow } from '.';
// import { NodeFuncMap } from '../nodes/index';
// import { ChatSysVars, SysVars } from '../constants';
import { NODES_EXTRA_INFO } from '../nodes/constants';
import { IterationNodeType } from '../nodes/iteration/types';
import { useStoreApi } from 'reactflow';
import { ChatSysVars, SysVars } from '../constants';

/**
 * startId: 万一selector是sys.xxx，因为sys.xxx在开始节点
 */
const findVarBySelector = ({
  selector,
  nodeOutputs,
  startId,
}: {
  selector: ValueSelector;
  nodeOutputs: NodeOutputVar[];
  startId?: string;
}) => {
  if (
    !selector ||
    !selector.length ||
    !nodeOutputs ||
    !nodeOutputs.length
  ) {
    return undefined;
  }
  let nid: string | undefined = selector[0];
  // const isSys = isSystemVar(selector);
  // if (isSys) {
  //   nid = startId;
  // }
  return nodeOutputs
    .find((v) => v.nodeId === nid)
    ?.vars?.find((v) => {
      return v.name === selector.join('.');
    });
};

/**
 * 原toNodeOutputVars，节点们的输出变量，iter时也仅是输出变量，没item
 */
const mapToOutputVars = ({
  // parentNode,
  nodes,
  isChatMode,
  environmentVariables = [],
  conversationVariables = [],
}: {
  nodes?: Node[];
  isChatMode: boolean;
  environmentVariables: VarWithConstVal[];
  conversationVariables: VarWithConstVal[];
}): NodeOutputVar[] => {
  const res: NodeOutputVar[] = [];
  // 节点的输出变量
  nodes?.forEach((node) => {
    let vars: NodeOutputVar['vars'] = [];
    const getOutputVars = NODES_EXTRA_INFO[node.data.type]?.getOutputVars;
    // const dataProcessor = NodeFuncMap[node.data.type];
    vars = [...vars, ...(getOutputVars?.(node.data) || [])];
    res.push({
      nodeId: node.id,
      title: node.data.title,
      vars,
    });
  });

  if (isChatMode) {
    res.push({
      nodeId: 'sys',
      title: '系统',
      vars: [...ChatSysVars],
    })
  } else {
    res.push({
      nodeId: 'sys',
      title: '系统',
      vars: [...SysVars],
    })
  }

  //环境变量
  if (environmentVariables.length) {
    res.push({
      nodeId: 'env',
      title: 'env',
      vars: environmentVariables.map((v) => ({
        name: v.name,
        type: v.value_type as unknown as VarType,
      })),
    });
  }
  //会话变量
  if (conversationVariables.length) {
    res.push({
      nodeId: 'chat',
      title: 'chat',
      vars: conversationVariables.map((v) => ({
        name: v.name,
        type: v.value_type as unknown as VarType,
      })),
    });
  }
  return res;
};

/**
 * node渲染、panel渲染时会用
 */
export const useWorkflowVariables = () => {
  const store = useContext(WorkflowDraftStoreContext)!;
  const environmentVariables = useStore(store, (s) => s.environmentVariables);
  const conversationVariables = useStore(store, (s) => s.conversationVariables);
  const isChatMode = useIsChatMode();
  const allTools = modelStore((s) => s.allTools); // 触发使用者组件刷新，因为tool的getOutputVars依赖allTools

  /**
   * 比较灵活的方法，自己决定哪些节点是可选的
   * iter比较特殊，他有正常输出和item输出，所以iter情况下，parentNode输出item，node输出正常输出
   */
  const getNodeVars = useCallback(
    ({
      nodes,
      parentNode,
      hideEnv,
      hideChat,
    }: {
      parentNode?: Node | null;
      nodes?: Node[];
      hideEnv?: boolean;
      hideChat?: boolean;
    }) => {
      // output vars
      const outputVars = mapToOutputVars({
        nodes: nodes,
        isChatMode,
        environmentVariables: hideEnv ? [] : environmentVariables,
        conversationVariables: hideChat ? [] : conversationVariables,
      });
      // iter inner var
      if (parentNode) {
        const startId = nodes?.find((node) => {
          return node.data.type === BlockEnum.IterationStart;
        })?.id;

        const filtered = findVarBySelector({
          selector: (parentNode.data as IterationNodeType).iterator_selector,
          nodeOutputs: outputVars,
          startId,
        });
        if (filtered) {
          let eleType: VarType;
          switch (filtered.type as VarType) {
            case VarType.arrayString:
              eleType = VarType.string;
              break;
            case VarType.arrayNumber:
              eleType = VarType.number;
              break;
            case VarType.arrayBoolean:
              eleType = VarType.boolean;
              break;
            case VarType.arrayObject:
              eleType = VarType.object;
              break;
            default:
              throw new Error(`not an array type: ${filtered.type}`);
          }
          const currIterVar = {
            nodeId: parentNode.id,
            title: '当前迭代',
            vars: [
              {
                name: 'item',
                type: eleType, // 迭代输入
              },
              {
                name: 'index',
                type: VarType.number,
              },
            ],
          };
          outputVars.push(currIterVar);
        }
      }
      return outputVars;
    },
    [conversationVariables, environmentVariables, isChatMode, allTools],
  );

  const findVarTypeBySelector = useCallback(
    ({
      selector,
      nodes,
      parentNode,
      hideEnv,
      hideChat,
    }: {
      selector: ValueSelector;
      nodes?: Node[];
      parentNode?: Node;
      hideEnv?: boolean;
      hideChat?: boolean;
    }) => {
      const accessibleVars: NodeOutputVar[] = getNodeVars({
        nodes,
        parentNode,
        hideEnv,
        hideChat,
      });
      const startId = nodes?.find((node) => {
        return node.data.type === BlockEnum.IterationStart;
      })?.id;
      const filtered = findVarBySelector({ selector, nodeOutputs: accessibleVars, startId });
      return filtered?.type;
    },
    [getNodeVars],
  );

  return { getNodeVars, findVarTypeBySelector };
};

export const useBeforeNodeVars = (props: { nodeId: string }) => {
  const { nodeId } = props;
  const { getNodeVars } = useWorkflowVariables();
  const { getBeforeNodesInSameBranch } = useWorkflow();
  const beforeNodes: Node[] = useMemo(() => {
    return getBeforeNodesInSameBranch(nodeId);
  }, [nodeId, getBeforeNodesInSameBranch]);

  const nd: Node = useNodeInfo(nodeId);
  const parentNode = useNodeInfo(nd?.parentId);

  return useMemo(() => {
    return getNodeVars({ nodes: beforeNodes, parentNode });
  }, [getNodeVars, beforeNodes, nodeId]);
};

// todo node 渲染，如何在引用变量变化后 刷新下