import type { FC } from 'react'
import React, { useCallback } from 'react'
import { NodeProps } from 'reactflow'
import { VariableAggregateNodeType } from './types'
import { Button, Card, Col, Divider, Flex, Input, Row, Space, Tag } from 'antd'
import { DeleteOutlined, FolderOutlined, PlusOutlined } from '@ant-design/icons'
import VarSelect from '../_base/components/variable/VarSelect'
import produce from 'immer'
import { useNodeDataUpdate } from '../../hooks'
import { ValueSelector, VarType } from '../../types'
import VarTypeSelect from '../_base/components/variable/VarTypeSelect'

const Panel: FC<NodeProps<VariableAggregateNodeType>> = ({
  id,
  data,
}) => {
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()

  const handleAddGroup = useCallback(() => {
    const newData = produce(data, draft => {
      draft.groups.push({
        name: undefined,
        output_type: VarType.string,
        variables: []
      })
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleGroupDel = useCallback((idx: number) => {
    const newData = produce(data, draft => {
      draft.groups.splice(idx, 1)
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleVarDel = useCallback((gid: number, vidx: number) => {
    const newData = produce(data, draft => {
      draft.groups[gid].variables.splice(vidx, 1)
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleAddVar = useCallback((gid: number) => {
    const newData = produce(data, draft => {
      draft.groups[gid].variables.push([])
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleSelectType = useCallback((type: VarType, index: number) => {
    const newData = produce(data, draft => {
      draft.groups[index].output_type = type
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleSelectVar = useCallback((val: ValueSelector, gid: number, idx: number) => {
    const newData = produce(data, draft => {
      draft.groups[gid].variables[idx] = val
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  return (
    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        <div className='space-y-2'>
          {data.groups.map((item, index) => (
            <Card key={index}>
              <Flex style={{ width: '100%' }} justify='space-between' align='center'>
                <Space>
                  <FolderOutlined />
                  <Input />
                  <VarTypeSelect value={item.output_type} onChange={(v) => handleSelectType(v, index)} disabled={item.variables?.length > 0} />
                  <DeleteOutlined onClick={() => handleGroupDel(index)} />
                </Space>
                {item.output_type && <PlusOutlined onClick={() => handleAddVar(index)} />}
              </Flex>
              {item.variables.map((v, vi) => <Row key={vi}>
                <Col span={22}><VarSelect disabled nodeId={id} value={v} onChange={(v) => handleSelectVar(v, index, vi)} type={item.output_type} /></Col>
                <Col span={2}><DeleteOutlined onClick={() => handleVarDel(index, vi)} /></Col>
              </Row>)}
              {index !== data.groups.length - 1 && <Divider />}
            </Card>
          ))}
        </div>
        <Button><PlusOutlined onClick={handleAddGroup} />添加分组</Button>
      </div>
    </div>
  )
}

export default React.memo(Panel)
