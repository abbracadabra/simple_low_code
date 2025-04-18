import {
  // BlockEnum,
//   ConversationVariable,
//   EnvironmentVariable,
  // type Node,
  // NodeInstanceAndOutPutVar,
  type ValueSelector,
  // VarType,
  // VarWithConstVal,
} from '@/components/workflow/types';
// import { NodeFuncMap } from '../../..';

// export const isSystemVar = (valueSelector: ValueSelector) => {
//   return valueSelector[0] === 'sys';
// };

// export const isENV = (valueSelector: ValueSelector) => {
//   return valueSelector[0] === 'env';
// };

export const isConversationVar = (valueSelector: ValueSelector) => {
  return valueSelector[0] === 'conv';
};

/**
 * 原toNodeOutputVars，节点们的输出变量，iter时也仅是输出变量，没item
 */  
// export const mapToOutputVars = ({
//   // parentNode,
//   nodes,
//   isChatMode,
//   environmentVariables= [],
//   conversationVariables = [],
// }:{nodes?: Node[],isChatMode:boolean,environmentVariables:VarWithConstVal[],conversationVariables:VarWithConstVal[]}
// ): NodeInstanceAndOutPutVar[] => {
//   const res: NodeInstanceAndOutPutVar[] = [];
//   // 节点的输出变量
//   nodes?.forEach((node) => {
//     let vars = [];
//     if (node.data.type === BlockEnum.Start) {
//       if (isChatMode) {
//         vars.push({
//             name: 'sys.query',
//             type: VarType.string,
//         });
//       }
//     }
//     const dataProcessor = NodeFuncMap[node.data.type];
//     vars = [...vars, ...(dataProcessor?.getOutputVars?.(node.data) || [])];
//     if (vars?.length) {
//       res.push({
//         nodeId: node.id,
//         title: node.data.title,
//         vars,
//       });
//     }
//   });
//   //环境变量
//   if (environmentVariables.length) {
//     res.push({
//         nodeId: 'env',
//         title: 'env',
//         vars: environmentVariables.map((v) => ({
//             name: v.name,
//             type: v.value_type,
//         })),
//       });
//   }
//   //会话变量
//   if (conversationVariables.length) {
//     res.push({
//         nodeId: 'chat',
//         title: 'chat',
//         vars: conversationVariables.map((v) => ({
//             name: v.name,
//             type: v.value_type,
//         })),
//       });
//   }
//   return res;
// };



// if env,conv var  filter by name
// beforenodes.find nodeid===sel[0], node.vars.find(varname==sel[1])

// filter node = sel[0] in beforenodes, then filter vars by name
// export const getVarType = ({
//   parentNode,
//   valueSelector,
//   isIterationItem,
//   availableNodes,
//   isChatMode,
//   isConstant,
//   environmentVariables = [],
//   conversationVariables = [],
// }: {
//   valueSelector: ValueSelector;
//   parentNode?: Node | null;
//   isIterationItem?: boolean;
//   availableNodes: any[];
//   isChatMode: boolean;
//   isConstant?: boolean;
//   environmentVariables?: EnvironmentVariable[];
//   conversationVariables?: ConversationVariable[];
// }): VarType => {
//   if (isConstant) return VarType.string;

//   const beforeNodesOutputVars = toNodeOutputVars(
//     availableNodes,
//     isChatMode,
//     undefined,
//     environmentVariables,
//     conversationVariables,
//   );

//   const isIterationInnerVar = parentNode?.data.type === BlockEnum.Iteration;
//   if (isIterationItem) {
//     return getIterationItemType({
//       valueSelector,
//       beforeNodesOutputVars,
//     });
//   }
//   if (isIterationInnerVar) {
//     if (valueSelector[1] === 'item') {
//       const itemType = getIterationItemType({
//         valueSelector: (parentNode?.data as any).iterator_selector || [],
//         beforeNodesOutputVars,
//       });
//       return itemType;
//     }
//     if (valueSelector[1] === 'index') return VarType.number;
//   }
//   const isSystem = isSystemVar(valueSelector);
//   const isEnv = isENV(valueSelector);
//   const isChatVar = isConversationVar(valueSelector);
//   const startNode = availableNodes.find((node: any) => {
//     return node.data.type === BlockEnum.Start;
//   });

//   const targetVarNodeId = isSystem ? startNode?.id : valueSelector[0];
//   const targetVar = beforeNodesOutputVars.find(
//     (v) => v.nodeId === targetVarNodeId,
//   );

//   if (!targetVar) return VarType.string;

//   let type: VarType = VarType.string;
//   let curr: any = targetVar.vars;
//   if (isSystem || isEnv || isChatVar) {
//     return curr.find(
//       (v: any) => v.variable === (valueSelector as ValueSelector).join('.'),
//     )?.type;
//   } else {
//     (valueSelector as ValueSelector).slice(1).forEach((key, i) => {
//       const isLast = i === valueSelector.length - 2;
//       curr = curr?.find((v: any) => v.variable === key);
//       if (isLast) {
//         type = curr?.type;
//       } else {
//         if (curr?.type === VarType.object || curr?.type === VarType.file)
//           curr = curr.children;
//       }
//     });
//     return type;
//   }
// };
