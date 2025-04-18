import {
  memo,
  useCallback,
  useContext,
} from 'react'
import { useStoreApi } from 'reactflow'
import {
  generateNewNode,
} from '../utils'
import {
  useValidBlocks,
  useNodesReadOnly,
} from '../hooks'
import { NODES_EXTRA_INFO, NODES_INITIAL_DATA } from '../nodes/constants'
import BlockSelector from '@/components/workflow/block-selector'
import type {
  OnSelectBlock,
} from '@/components/workflow/types'
import {
  BlockEnum,
} from '@/components/workflow/types'
import { WorkflowDraftStoreContext } from '../context'
import { Tooltip } from 'antd'

type AddBlockProps = {
}

// 候选节点，见candidate-node.tsx
const AddBlock = ({
  // offset,
}: AddBlockProps) => {
  const store = useStoreApi()
  const workflowStore = useContext(WorkflowDraftStoreContext)
  const { nodesReadOnly } = useNodesReadOnly()
  const { validNextBlocks } = useValidBlocks(BlockEnum.Start, false)

  const handleSelect = useCallback<OnSelectBlock>((type, dataExtra={}) => {
    const {
      getNodes,
    } = store.getState()
    const nodes = getNodes()
    const nodesWithSameType = nodes.filter(node => node.data.type === type)
    const { newNode } = generateNewNode({
      data: {
        ...NODES_INITIAL_DATA[type],
        title: nodesWithSameType.length > 0 ? `${NODES_EXTRA_INFO[type].title} ${nodesWithSameType.length + 1}` : NODES_EXTRA_INFO[type].title,
        ...dataExtra,
      },
      position: {
        x: 0,
        y: 0,
      },
    })
    workflowStore.setState({
      candidateNode: newNode,
    })
  }, [store, workflowStore])

  return (
    <Tooltip title='添加节点'>
      <BlockSelector
        disabled={nodesReadOnly}
        onSelect={handleSelect}
        placement='top-start'
        popupClassName='!min-w-[256px]'
        validBlocksTypes={validNextBlocks}
      />
    </Tooltip>
  )
}

export default memo(AddBlock)
