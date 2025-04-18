import type { FC } from 'react'
import React, { useCallback } from 'react'
import { NodeSourceHandle } from '../node-base/components/node-handle'
import { valueLessOperator } from './utils'
import type { CaseItem, IfElseNodeType } from './types'
import type { Node, NodeProps } from '@/components/workflow/types'
import { useNodes } from 'reactflow'
import { useNodeTitle } from '../../hooks'

const displayInNode = (val: CaseItem['value']) => {
  return Array.isArray(val) ? val[val.length - 1] : val
}

const IfElseNode: FC<NodeProps<IfElseNodeType>> = (props) => {
  const { data } = props
  const { cases } = data
  const { getNodeTitle } = useNodeTitle()
  const checkIsConditionSet = useCallback((condition: CaseItem) => {
    if (!condition || !condition.variable_selector || condition.variable_selector.length === 0)
      return false

    if (valueLessOperator(condition.comparison_operator!))
      return true

    return !!condition.value
  }, [])
  const conditionNotSet = (<div className='flex items-center h-6 px-1 space-x-1 text-xs font-normal text-text-secondary bg-workflow-block-parma-bg rounded-md'>
    条件未设置
  </div>)

  return (
    <div className='px-3'>
      {
        cases.map((caseItem, index) => (
          <div key={caseItem.case_id}>
            <div className='relative flex items-center h-6 px-1'>
              <div className='flex items-center justify-between w-full'>
                <div className='text-[12px] font-semibold text-text-secondary'>{index === 0 ? 'IF' : 'ELIF'}</div>
              </div>
              <NodeSourceHandle
                {...props}
                handleId={caseItem.case_id}
                handleClassName='!top-1/2 !-right-[21px] !-translate-y-1/2'
              />
            </div>
            <div className='space-y-0.5'>
              <div className='relative'>
                {
                  checkIsConditionSet(caseItem)
                    ? (
                      <span>{ getNodeTitle(caseItem.variable_selector[0])+'/'+caseItem.variable_selector.slice(1).join('.')} &nbsp; {caseItem.comparison_operator}&nbsp;{displayInNode(caseItem.value)}</span>
                    )
                    : conditionNotSet}
                {/* and and and、or or or */}
                {/* {i !== caseItem.conditions.length - 1 && (
                  <div className='absolute z-10 right-1 bottom-[-10px] leading-4 text-[10px] font-medium text-text-accent uppercase'>{caseItem.logical_operator}</div>
                )} */}
              </div>
            </div>
          </div>
        ))
      }
      {/* default */}
      <div className='relative flex items-center h-6 px-1'>
        <div className='w-full text-xs font-semibold text-right text-text-secondary'>ELSE</div>
        <NodeSourceHandle
          {...props}
          handleId='false'
          handleClassName='!top-1/2 !-right-[21px] !-translate-y-1/2'
        />
      </div>
    </div>
  )
}

export default React.memo(IfElseNode)
