import type { FC } from 'react'
import React, { useCallback, useMemo } from 'react'
import type { AnswerNodeType } from './types'
import { NodeProps } from '../../types'
import { useNodeDataUpdate, useNodesReadOnly, useWorkflowVariables } from '../../hooks'
import Editor from '../_base/components/prompt/editor'
import produce from 'immer'

const Panel: FC<NodeProps<AnswerNodeType>> = ({
  id,
  data,
}) => {
  const {getBeforeNodeVars} = useWorkflowVariables()
  const nodeVars = useMemo(()=> getBeforeNodeVars(id), [getBeforeNodeVars, id])
  // const nodeVars = useBeforeNodeVars({ nodeId: id })
  const {
    handleNodeDataUpdateWithSyncDraft,
  } = useNodeDataUpdate()

  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const handleOnChange = useCallback((value: string) => {
    const newInputs = produce(data, (draft) => {
      draft.answer = value
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newInputs,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  return (
    <div className='mt-2 mb-2 px-4 space-y-4'>
      <Editor
        disabled={readOnly}
        value={data.answer}
        onChange={handleOnChange}
        varList={nodeVars}
      />
    </div>
  )
}

export default React.memo(Panel)
