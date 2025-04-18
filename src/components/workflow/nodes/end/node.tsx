import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import type { EndNodeType } from './types'
import type { NodeProps, VarWithSelector } from '@/components/workflow/types'
// import { isConversationVar, isENV, isSystemVar } from '@/components/workflow/nodes/_base/components/variable/utils'
import {
  useWorkflow,
  useWorkflowVariables,
} from '@/components/workflow/hooks'
// import { BlockEnum } from '@/components/workflow/types'

const Node: FC<NodeProps<EndNodeType>> = ({
  // id,
  // data,
}) => {
  // const { getBeforeNodesInSameBranch } = useWorkflow()
  // const availableNodes = getBeforeNodesInSameBranch(id) // 获取连通着的所有前面节点
  // const { findVarTypeBySelexctor } = useWorkflowVariables()
  // const isChatMode = useIsChatMode()

  // const startNode = availableNodes.find((node: any) => {
  //   return node.data.type === BlockEnum.Start
  // })

  // const getNode = (id: string) => {
  //   return availableNodes.find(nd => nd.id === id)
  // }

  // const { outputs } = data
  // const filteredOutputs = (outputs as VarWithValue[]).filter(({ value_selector }) => value_selector.length > 0)

  // if (!filteredOutputs.length)
  //   return null

  return (
    <div className='mb-1 px-3 py-1 space-y-0.5'>
    </div>
  )
}

export default React.memo(Node)



// {filteredOutputs.map(({ value_selector }, index) => {
//   // value_selector [节点id,变量]
//   const nodeId = value_selector[0] // 注意sys env conversation 节点是没的
//   const varName = value_selector[value_selector.length - 1]
//   const node = getNode(nodeId)
//   const isSystem = isSystemVar(value_selector) // sys.xxx
//   const isEnv = isENV(value_selector) // env.xxx
//   const isChatVar = isConversationVar(value_selector) // conversation.xxx
//   const varType = findVarTypeBySelexctor({
//     selector: value_selector, // [节点id,变量]
//     nodes:availableNodes,
//   })
//   // 节点title 变量名 类型
//   return (
//     <div key={index} className='flex items-center h-6 justify-between bg-gray-100 rounded-md  px-1 space-x-1 text-xs font-normal text-gray-700'>
//       <div className='flex items-center text-xs font-medium text-gray-500'>
//         {/* 节点title */}
//         <div className='max-w-[75px] truncate'>
//           { isSystem && '系统变量' }
//           { isEnv && '环境变量' }
//           { isChatVar && '会话变量' }
//           { !isSystem && !isEnv && !isChatVar && node?.data.title }
//         </div> 
//         / {/* 斜线/ */}
//         <div className='flex items-center text-primary-600'>
//           <div className={cn('max-w-[50px] ml-0.5 text-xs font-medium truncate')}>{varName}</div> {/* 变量名 */}
//         </div>
//       </div>
//       {/* 类型 */}
//       <div className='text-xs font-normal text-gray-700'>
//         <div className='max-w-[42px] ml-0.5 text-xs font-normal text-gray-500 capitalize truncate' title={varType}>{varType}</div>
//       </div>
//     </div>
//   )
// })}