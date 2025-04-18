import type { FC } from 'react'
import React from 'react'
// import { useNodes } from 'reactflow'
// import { useTranslation } from 'react-i18next'
// import NodeVariableItem from '../variable-assigner/components/node-variable-item'
import { type AssignerNodeType } from './types'
// import { isConversationVar, isENV, isSystemVar } from '@/components/workflow/nodes/_base/components/variable/utils'
import { type NodeProps } from '@/components/workflow/types'

// const i18nPrefix = 'workflow.nodes.assigner'

const NodeComponent: FC<NodeProps<AssignerNodeType>> = ({
  data,
}) => {
  // const { t } = useTranslation()

  // const nodes: Node[] = useNodes()
  const { items: operationItems } = data
  const validOperationItems = operationItems?.filter(item =>
    item.varToBeAssigned && item.varToBeAssigned.length > 0,
  ) || []

  if (validOperationItems.length === 0) {
    return (
      <div className='relative flex flex-col px-3 py-1 gap-0.5 items-start self-stretch'>
        <div className='flex flex-col items-start gap-1 self-stretch'>
          <div className='flex px-[5px] py-1 items-center gap-1 self-stretch rounded-md bg-workflow-block-parma-bg'>
            <div className='flex-1 text-text-tertiary system-xs-medium'>未设置变量</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='relative flex flex-col px-3 py-1 gap-0.5 items-start self-stretch'>
      {operationItems.map((item, index) => {
        const varToBeAssigned = item.varToBeAssigned
        if (!varToBeAssigned || varToBeAssigned.length === 0)
          return null
        // const isSystem = isSystemVar(varToBeAssigned)
        // const isEnv = isENV(varToBeAssigned)
        // const isChatVar = isConversationVar(varToBeAssigned)
        // const node = isSystem ? nodes.find(node => node.data.type === BlockEnum.Start) : nodes.find(node => node.id === varToBeAssigned[0])
        // const varName = isSystem ? `sys.${varToBeAssigned[varToBeAssigned.length - 1]}` : varToBeAssigned.slice(1).join('.')
        const varName = varToBeAssigned.slice(1).join('.') // 取消conversation.xxx前缀
        return <div key={index}>{varName}</div>
        // return (
        //   <NodeVariableItem
        //     key={index}
        //     node={node as Node}
        //     isEnv={isEnv}
        //     isChatVar={isChatVar}
        //     writeMode={item.operation}
        //     varName={varName}
        //     className='bg-workflow-block-parma-bg'
        //   />
        // )
      })}
    </div>
  )
}

export default React.memo(NodeComponent)
