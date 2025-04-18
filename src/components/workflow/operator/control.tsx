// import type { MouseEvent } from 'react'
import {
  memo,
} from 'react'
// import { useTranslation } from 'react-i18next'
import {
  RiMouseLine,
} from '@remixicon/react'
import {
  useNodesReadOnly,
  // useWorkflowOrganize,
} from '../hooks'
import {
  ControlMode,
} from '../types'
// import { useWorkflowStore } from '../store'
import AddBlock from './add-block'
// import { useOperator } from './hooks'
import cn from '@/utils/classnames'
// import {BookOutlined} from '@ant-design/icons'
import { useWorkflowDraftStore } from '../context'
import { Divider, Tooltip } from 'antd'
import { BorderOutlined } from '@ant-design/icons'

const Control = () => {
  // const controlMode = useWorkflowStore(s => s.controlMode)
  const setControlMode = useWorkflowDraftStore(s => s.setControlMode)
  // const { handleAddNote } = useOperator()
  const {
    nodesReadOnly,
    getNodesReadOnly,
  } = useNodesReadOnly()

  // const addNote = (e: MouseEvent<HTMLDivElement>) => {
  //   if (getNodesReadOnly())
  //     return

  //   e.stopPropagation()
  //   handleAddNote()
  // }

  return (
    <div className='flex items-center p-0.5 rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg shadow-lg text-text-tertiary'>
      {/* 添加候选节点 */}
      <AddBlock />
      {/* <Divider type="vertical" />
      <Tooltip title='添加注释'>
        <div
          className={cn(
            'flex items-center justify-center ml-[1px] w-8 h-8 rounded-lg hover:bg-state-base-hover hover:text-text-secondary cursor-pointer',
            `${nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'}`,
          )}
          onClick={addNote}
        >
          <BookOutlined style={{ fontSize: '16px' }} />
        </div>
      </Tooltip> */}
      <Divider type="vertical" />
      {/* 操作模式 */}
      <Tooltip title='触控板友好模式'>
        <div
          className={cn(
            'flex items-center justify-center mr-[1px] w-8 h-8 rounded-lg cursor-pointer',
            `${nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'}`,
          )}
        >
          <BorderOutlined style={{ fontSize: '16px' }} onClick={() => { setControlMode(ControlMode.pad) }} />
          {/* <RiCursorLine className='w-4 h-4' /> */}
        </div>
      </Tooltip>
      <Tooltip title='鼠标友好模式'>
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer',
            `${nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'}`,
          )}
        >
          <RiMouseLine className='w-4 h-4' onClick={() => { setControlMode(ControlMode.mouse) }} />
          {/* <RiHand className='w-4 h-4' /> */}
        </div>
      </Tooltip>
      {/* <Divider type='vertical' className='h-3.5 mx-0.5' /> */}
      {/* 整理节点 */}
      {/* <Tooltip title={t('workflow.panel.organizeBlocks')}>
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-lg hover:bg-state-base-hover hover:text-text-secondary cursor-pointer',
            `${nodesReadOnly && 'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'}`,
          )}
          onClick={handleLayout}
        >
          <RiFunctionAddLine className='w-4 h-4' />
        </div>
      </Tooltip> */}
    </div>
  )
}

export default memo(Control)
