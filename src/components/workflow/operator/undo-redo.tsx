import type { FC } from 'react'
import { memo, useState } from 'react'
// import { useWorkflowHistoryStore } from '../workflow-history-store'
import { Tooltip } from 'antd'
import { UndoOutlined, RedoOutlined } from '@ant-design/icons'
import { useNodesReadOnly } from '../hooks'

export type UndoRedoProps = { handleUndo: () => void; handleRedo: () => void }
const UndoRedo: FC<UndoRedoProps> = ({ handleUndo, handleRedo }) => {
  // const { store } = useWorkflowHistoryStore()
  // const [buttonsDisabled, setButtonsDisabled] = useState({ undo: true, redo: true })

  // useEffect(() => {
  //   const unsubscribe = store.temporal.subscribe((state) => {
  //     setButtonsDisabled({
  //       undo: state.pastStates.length === 0,
  //       redo: state.futureStates.length === 0,
  //     })
  //   })
  //   return () => unsubscribe()
  // }, [store])

  const { nodesReadOnly } = useNodesReadOnly()

  return (
    <div className='flex items-center space-x-0.5 p-0.5 backdrop-blur-[5px] rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg shadow-lg'>
      <Tooltip title='撤销' >
        <UndoOutlined style={{ fontSize: '12px' }} onClick={() => !nodesReadOnly && handleUndo()} />
      </Tooltip >
      <Tooltip title='重做'>
        <RedoOutlined style={{ fontSize: '12px' }} onClick={() => !nodesReadOnly && handleRedo()} />
      </Tooltip>
    </div >
  )
}

export default memo(UndoRedo)
