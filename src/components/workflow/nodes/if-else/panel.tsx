import type { FC } from 'react'
import {
  memo,
  useCallback,
  useMemo,
} from 'react'
import { ComparisonOperator, type CaseItem, type IfElseNodeType } from './types'
import { Button, Col, Row, Select } from 'antd'
import { DeleteOutlined, DragOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { NodeProps, VarType } from '../../types'
import VarSelect from '../_base/components/variable/VarSelect'
import { ReactSortable } from 'react-sortablejs'
import produce from 'immer'
import { useEdgesInteractions, useNodeDataUpdate, useNodesReadOnly, useWorkflow, useWorkflowVariables } from '../../hooks'
import { useUpdateNodeInternals } from 'reactflow'
import { valueLessOperator } from './utils'
import VarSelectInput from '../_base/components/variable/VarSelectInput'
import { v4 as uuid4 } from 'uuid'

const Panel: FC<NodeProps<IfElseNodeType>> = ({
  id,
  data,
}) => {
  const cases = data.cases || []
  const casesLength = cases.length
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()
  const { handleEdgeDeleteByDeleteBranch } = useEdgesInteractions()

  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  // const updateNodeInternals = useUpdateNodeInternals()

  const {getBeforeNodeVars} = useWorkflowVariables()
  const nodeVars = useMemo(() => getBeforeNodeVars(id), [getBeforeNodeVars, id])
  // const nodeVars = useBeforeNodeVars({ nodeId: id })

  const handleSort = useCallback((sortedCases: (CaseItem & { id: string })[]) => {
    const newData = produce(data, (draft) => {
      draft.cases = sortedCases.filter(Boolean).map(item => {
        const res = {
          ...item,
        }
        delete res.id
        return res
      })
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
    // updateNodeInternals(id)
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleRemoveCase = useCallback((caseId: string) => {
    const newData = produce(data, (draft) => {
      draft.cases = draft.cases?.filter(item => item.case_id !== caseId) // 删除case
      handleEdgeDeleteByDeleteBranch(id, caseId) // 删除handle连的线
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft, id, handleEdgeDeleteByDeleteBranch])

  const handleAddCase = useCallback(() => {
    const newData = produce(data, (draft) => {
      if (!draft.cases) {
        draft.cases = []
      }
      const case_id = uuid4()
      draft.cases.push({
        case_id,
      })
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleUpdateCondition = useCallback((caseId: string, newCondition: Partial<CaseItem>) => {
    const newData = produce(data, (draft) => {
      const targetCase = draft.cases?.find(item => item.case_id === caseId)
      if (targetCase) {
        Object.assign(targetCase, newCondition)
      }
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  return (
    <div className='p-1'>
      <ReactSortable
        list={cases.map(caseItem => ({ ...caseItem, id: caseItem.case_id }))}
        setList={handleSort}
        handle='.handle'
        ghostClass='bg-components-panel-bg'
        disabled={readOnly}
        animation={150}>
        {
          cases.map((item, index) => {
            const [first, ...second] = item.variable_selector
            const type = nodeVars.find(nv => nv.nodeId === first).vars.find(v => v.name === second.join(".")).type

            let compareType: VarType
            if (type === VarType.string || type === VarType.arrayString) {
              compareType = VarType.string
            }
            if (type === VarType.number || type === VarType.arrayNumber) {
              compareType = VarType.number
            }
            if (type === VarType.boolean || type === VarType.arrayBoolean) {
              compareType = VarType.boolean
            }

            return (
              <Row key={item.case_id}>
                <Col span={6}>
                  <DragOutlined className="handle" />
                  {index === 0 ? 'IF' : 'ELIF'}
                </Col>
                <Col span={8}><VarSelect nodeId={id} value={item.variable_selector} onChange={(v) => {
                  handleUpdateCondition(item.case_id, { variable_selector: v, comparison_operator: undefined, value: undefined })
                }}
                /></Col>
                <Col span={8}><Select value={item.comparison_operator} options={typeAndComparator[type].map((c => ({ label: c, value: c })))} onChange={(v) => {
                  handleUpdateCondition(item.case_id, { comparison_operator: v })
                }} /></Col>
                <Col span={2}>
                  {
                    ((index === 0 && casesLength > 1) || (index > 0)) && (
                      <DeleteOutlined onClick={() => handleRemoveCase(item.case_id)} />
                    )
                  }</Col>
                <Col span={24}>{valueLessOperator(item.comparison_operator) ? undefined : <VarSelectInput mix={true} nodeId={id} type={compareType} value={item.value} onChange={(v) => {
                  handleUpdateCondition(item.case_id, { value: v })
                }} />}</Col>
              </Row>
            )
          })}
      </ReactSortable>
      {/* 加分支 */}
      <div className='px-4 py-2'>
        <Button
          className='w-full'
          onClick={handleAddCase}
          disabled={readOnly}
        >
          <PlusOutlined />ELIF
        </Button>
      </div>
    </div>
  )
}

export default memo(Panel)

const typeAndComparator = {
  [VarType.boolean]: [ComparisonOperator.equal, ComparisonOperator.notEqual, ComparisonOperator.exists, ComparisonOperator.notExists],
  [VarType.number]: [ComparisonOperator.equal, ComparisonOperator.notEqual, ComparisonOperator.exists, ComparisonOperator.notExists, ComparisonOperator.largerThan, ComparisonOperator.lessThan, ComparisonOperator.largerThanOrEqual, ComparisonOperator.lessThanOrEqual],
  [VarType.string]: [ComparisonOperator.equal, ComparisonOperator.notEqual, ComparisonOperator.exists, ComparisonOperator.notExists, ComparisonOperator.contains, ComparisonOperator.notContains, ComparisonOperator.startWith, ComparisonOperator.endWith],
  [VarType.object]: [ComparisonOperator.exists, ComparisonOperator.notExists],
  [VarType.arrayString]: [ComparisonOperator.exists, ComparisonOperator.notExists, ComparisonOperator.contains, ComparisonOperator.notContains],
  [VarType.arrayNumber]: [ComparisonOperator.exists, ComparisonOperator.notExists, ComparisonOperator.contains, ComparisonOperator.notContains],
  [VarType.arrayBoolean]: [ComparisonOperator.exists, ComparisonOperator.notExists, ComparisonOperator.contains, ComparisonOperator.notContains],
  [VarType.arrayObject]: [ComparisonOperator.exists, ComparisonOperator.notExists],
}