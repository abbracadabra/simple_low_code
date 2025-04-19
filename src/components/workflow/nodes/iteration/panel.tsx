import type { FC } from 'react'
import React, { useCallback } from 'react'
import type { IterationNodeType } from './types'
import { NodeProps, ValueSelector, VarType } from '@/components/workflow/types'
import VarSelect from '../_base/components/variable/VarSelect'
import ChildVarSelect from './ChildVarSelect'
import { Divider, Flex, InputNumber, Switch, Tag, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useNodeDataUpdate } from '../../hooks'


const isArrayType = (type: VarType) => {
  return type === VarType.arrayBoolean || type === VarType.arrayNumber || type === VarType.arrayObject || type === VarType.arrayString
}

const Panel: FC<NodeProps<IterationNodeType>> = ({
  id,
  data,
}) => {

  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()

  const handleSetInput = useCallback((value: ValueSelector) => {
    const newData = {
      ...data,
      iterator_selector: value,
    }
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleSetOutput = useCallback((value: ValueSelector, type: VarType) => {
    const newData = {
      ...data,
      output_selector: value,
      output_type: arrayTypeMapping[type],
    }
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleIsParallel = useCallback((value: boolean) => {
    const newData = {
      ...data,
      is_parallel: value,
    }
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleParallelNum = useCallback((value: number) => {
    const newData = {
      ...data,
      parallel_nums: value,
    }
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  return (
    <div className='pt-2 pb-2'>
      <Flex style={{ width: '100%' }} justify='space-between' align='center'>
        <div>输入</div>
        <Tag>Array</Tag>
      </Flex>
      <VarSelect nodeId={id} value={data.iterator_selector} onChange={handleSetInput} varFilter={(v, o) => isArrayType(v.type)} />
      <Divider />

      <Flex style={{ width: '100%' }} justify='space-between' align='center'>
        <div>输出变量</div>
        <Tag>Array</Tag>
      </Flex>
      <ChildVarSelect nodeId={id} value={data.output_selector} onChange={handleSetOutput} />
      <Divider />

      <Flex style={{ width: '100%' }} justify='space-between' align='center'>
        <Tooltip title="在并行模式下，迭代中的任务支持并行执行。"><div>并行模式<QuestionCircleOutlined /></div></Tooltip>
        <Switch value={data.is_parallel} onChange={handleIsParallel} />
      </Flex>
      最大并行度 <InputNumber min={1} max={10} value={data.parallel_nums} onChange={handleParallelNum} />
    </div>
  )
}

export default React.memo(Panel)


const arrayTypeMapping = {
  [VarType.string]: VarType.arrayString,
  [VarType.number]: VarType.arrayNumber,
  [VarType.boolean]: VarType.arrayBoolean,
  [VarType.object]: VarType.arrayObject,

  [VarType.arrayString]: VarType.arrayObject,
  [VarType.arrayNumber]: VarType.arrayObject,
  [VarType.arrayBoolean]: VarType.arrayObject,
  [VarType.arrayObject]: VarType.arrayObject,
} as Record<VarType, VarType>