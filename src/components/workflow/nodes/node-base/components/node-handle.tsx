import type { MouseEvent } from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  Handle,
  Position,
} from 'reactflow'
// import { useTranslation } from 'react-i18next'
import { BlockEnum } from '../../../types'
import type { Node, OnSelectBlock } from '../../../types'
import BlockSelector from '../../../block-selector'
// import type { ToolDefaultValue } from '../../../block-selector/types'
import {
  useValidBlocks,
  useIsChatMode,
  useNodesInteractions,
  useNodesReadOnly,
} from '../../../hooks'
import {
  useWorkflowDraftStore,
} from '../../../context'
// import { ToolNodeType } from '../../tool/types'

type NodeHandleProps = {
  handleId: string
  handleClassName?: string
  nodeSelectorClassName?: string
} & Pick<Node, 'id' | 'data'>

/**
 * 节点handle和点击+号
 */
export const NodeTargetHandle = memo(({
  id,
  data,
  handleId,
  handleClassName,
  nodeSelectorClassName,
}: NodeHandleProps) => {
  // const [open, setOpen] = useState(false) // 选择面板打开
  const { handleNodeAdd } = useNodesInteractions()
  const { getNodesReadOnly } = useNodesReadOnly()
  // const connected = data._connectedTargetHandleIds?.includes(handleId)
  const { validPrevBlocks: availablePrevBlocks } = useValidBlocks(data.type, data.isInIteration) // 可选上个节点
  const isConnectable = !!availablePrevBlocks.length

  // const handleOpenChange = useCallback((v: boolean) => {
  //   setOpen(v)
  // }, [])
  // const handleHandleClick = (e: MouseEvent) => {
  //   e.stopPropagation()
  //   // if (!connected)
  //   setOpen(v => !v)
  // }
  // , [connected])
  const handleSelect = useCallback<OnSelectBlock>((type, dataExtra) => {
    handleNodeAdd(
      {
        nodeType: type,
        dataExtra,
      },
      {
        nextNodeId: id,
        nextNodeTargetHandle: handleId,
      },
    )
  }, [handleNodeAdd, id, handleId])

  return (
    <>
      <Handle
        id={handleId}
        type='target'
        position={Position.Left}
        className={`
          !w-4 !h-4 !bg-transparent !rounded-none !outline-none !border-none z-[1]
          after:absolute after:w-0.5 after:h-2 after:left-1.5 after:top-1 after:bg-primary-500
          hover:scale-125 transition-all
          ${data.type === BlockEnum.Start && 'opacity-0'}
          ${handleClassName}
        `}
        isConnectable={isConnectable}
        // onClick={handleHandleClick}
      >
        {
          // 连接点
          // !connected && 
          isConnectable && !getNodesReadOnly() && (
            // 加号
            <BlockSelector
              // open={open}
              // onOpenChange={handleOpenChange}
              onSelect={handleSelect}
              asChild
              placement='left'
              validBlocksTypes={availablePrevBlocks}
            />
          )
        }
      </Handle>
    </>
  )
})
NodeTargetHandle.displayName = 'NodeTargetHandle'


/**
 * 节点handle和点击+号
 */
export const NodeSourceHandle = memo(({
  id,
  data,
  handleId,
  handleClassName,
  // nodeSelectorClassName,
}: NodeHandleProps) => {
  const { t } = useTranslation()
  const notInitialWorkflow = useWorkflowDraftStore(s => s.notInitialWorkflow)
  const [open, setOpen] = useState(false)
  const { handleNodeAdd } = useNodesInteractions()
  const { getNodesReadOnly } = useNodesReadOnly()
  const { validNextBlocks } = useValidBlocks(data.type, data.isInIteration)
  const isConnectable = !!validNextBlocks.length
  const isChatMode = useIsChatMode() // app type

  // const connected = data._connectedSourceHandleIds?.includes(handleId)
  const handleOpenChange = useCallback((v: boolean) => {
    setOpen(v)
  }, [])
  const handleHandleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    // if (checkParallelLimit(id, handleId))
      setOpen(v => !v)
  // }, [checkParallelLimit, id, handleId])
  }, [])
  const handleSelect = useCallback<OnSelectBlock>((type, dataExtra) => {
    handleNodeAdd(
      {
        nodeType: type,
        dataExtra,
      },
      {
        prevNodeId: id,
        prevNodeSourceHandle: handleId,
      },
    )
  }, [handleNodeAdd, id, handleId])

  useEffect(() => {
    if (notInitialWorkflow && data.type === BlockEnum.Start && !isChatMode)
      setOpen(true)
  }, [notInitialWorkflow, data.type, isChatMode])

  return (
    <Handle
      id={handleId}
      type='source'
      position={Position.Right}
      className={`
        group/handle !w-4 !h-4 !bg-transparent !rounded-none !outline-none !border-none z-[1]
        after:absolute after:w-0.5 after:h-2 after:right-1.5 after:top-1 after:bg-primary-500
        hover:scale-125 transition-all
        ${handleClassName}
      `}
      isConnectable={isConnectable}
      onClick={handleHandleClick}
    >
      {
        isConnectable && !getNodesReadOnly() && (
          // 加号
          <BlockSelector
            open={open}
            onOpenChange={handleOpenChange}
            onSelect={handleSelect}
            asChild
            // triggerClassName={open => `
            //   hidden absolute top-0 left-0 pointer-events-none 
            //   ${nodeSelectorClassName}
            //   group-hover:!flex
            //   ${data.selected && '!flex'}
            //   ${open && '!flex'}
            // `}
            validBlocksTypes={validNextBlocks}
          />
        )
      }
    </Handle>
  )
})
NodeSourceHandle.displayName = 'NodeSourceHandle'
