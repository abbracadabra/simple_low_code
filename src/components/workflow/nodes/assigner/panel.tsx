import type { FC } from 'react'
import React, { useCallback } from 'react'
import { WriteMode, type AssignerNodeType } from './types'
import { NodeProps, ValueSelector } from '../../types'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Col, Row, Select } from 'antd'
import VarSelect from '../_base/components/variable/VarSelect'
import { useNodeDataUpdate, useWorkflowVariables } from '../../hooks'
import produce from 'immer'
import VarSelectInput from '../_base/components/variable/VarSelectInput'
import VarInput from '../_base/components/variable/VarInput'

const Panel: FC<NodeProps<AssignerNodeType>> = ({
  id,
  data,
}) => {
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()
  const handleAddOperation = useCallback(() => {
    const newItem = {
      varToBeAssigned: undefined,
      operation: WriteMode.set,
      value: undefined,
    }
    const newData = produce(data, draft => {
      draft.items.push(newItem)
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleRemove = useCallback((index: number) => {
    const newList = produce(data, (draft) => {
      draft.items.splice(index, 1)
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newList,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleTargetVar = useCallback((value: ValueSelector, index: number) => {
    const newData = produce(data, (draft) => {
      draft.items[index].varToBeAssigned = value
      draft.items[index].value = undefined
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const { findVarTypeBySelector } = useWorkflowVariables()

  return (
    <div className='flex py-2 flex-col items-start self-stretch'>
      <div className='flex flex-col justify-center items-start gap-1 px-4 py-2 w-full self-stretch'>
        <div className='flex items-start gap-2 self-stretch'>
          <div className='flex flex-col justify-center items-start flex-grow text-text-secondary system-sm-semibold-uppercase'>变量</div>
          <PlusOutlined onClick={handleAddOperation} />
        </div>
        {data.items.map((item, index) => {

// findVarTypeBySelector({selector:item.varToBeAssigned,})
          // item.varToBeAssigned
          return <div>
            <Row>
              <Col span={18}><VarSelect nodeId={id} value={item.varToBeAssigned} onChange={(v) => handleTargetVar(v, index)} /></Col>
              <Col span={4}><Select value={item.operation} options={Object.values(WriteMode).map((v) => ({ label: v, value: v }))} onChange={  }></Select></Col>
              <Col span={2}><DeleteOutlined onClick={() => handleRemove(index)} /></Col>
            </Row>
            {item.operation !== WriteMode.clear && <Row>
              <Col span={18}><VarSelect nodeId={id} value={item.value} type={item.}  /></Col>
            </Row>}
          </div>
        })}
      </div>
    </div>
  )
}

export default React.memo(Panel)
