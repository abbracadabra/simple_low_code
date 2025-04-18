import {
  memo,
  useContext,
} from 'react'
import produce from 'immer'
import {
  useReactFlow,
  useStoreApi,
  useViewport,
} from 'reactflow'
import { useEventListener } from 'ahooks'
import { WorkflowHistoryEvent, useWorkflowHistoryStore } from './hooks'
import { COMMON_NODE } from './constants'
import { getIterationStartNode } from './utils'
// import CommonNode from './nodes'
import NodeCommonBase from './nodes/node-base'
// import CustomNoteNode from './note-node' // todo 
import { CUSTOM_NOTE_NODE } from './note-node/constants'
import { BlockEnum } from './types'
import { useWorkflowDraftStore, WorkflowDraftStoreContext } from './context'

const CandidateNode = () => {
  const store = useStoreApi()
  const reactflow = useReactFlow()
  const workflowStore = useContext(WorkflowDraftStoreContext)
  const candidateNode = useWorkflowDraftStore(s => s.candidateNode)
  const mousePosition = useWorkflowDraftStore(s => s.mousePosition)
  const { zoom } = useViewport()
  // const { handleNodeSelect } = useNodesInteractions()
  const { updateLocalHistory } = useWorkflowHistoryStore()

  // 把伪节点放进reactflow
  useEventListener('click', (e) => {
    const { candidateNode, mousePosition } = workflowStore.getState()

    if (candidateNode) {
      e.preventDefault()
      const {
        getNodes,
        setNodes,
      } = store.getState()
      const { screenToFlowPosition } = reactflow
      const nodes = getNodes()
      // 把鼠标的屏幕位置转换成画布的坐标。reactflow画布里的(0,0)是在画布中的一个位置，不是画布屏幕最左上角
      const { x, y } = screenToFlowPosition({ x: mousePosition.pageX, y: mousePosition.pageY })
      const newNodes = produce(nodes, (draft) => {
        draft.push({
          ...candidateNode,
          data: candidateNode.data,
          position: {
            x,
            y,
          },
        })
        if (candidateNode.data.type === BlockEnum.Iteration)
          draft.push(getIterationStartNode(candidateNode.id))
      })
      setNodes(newNodes) // onclick时把candidate加到reactflow
      console.log('nn m,m ')
      console.log(getNodes())
      if (candidateNode.type === CUSTOM_NOTE_NODE) {
        updateLocalHistory(WorkflowHistoryEvent.NoteAdd)
      } else {
        updateLocalHistory(WorkflowHistoryEvent.NodeAdd)
      }

      workflowStore.setState({ candidateNode: undefined })

      // if (candidateNode.type === CUSTOM_NOTE_NODE)
        // handleNodeSelect(candidateNode.id)
    }
  })

  useEventListener('contextmenu', (e) => {
    const { candidateNode } = workflowStore.getState()
    if (candidateNode) {
      e.preventDefault()
      workflowStore.setState({ candidateNode: undefined })
    }
  })

  if (!candidateNode)
    return null

  return (
    <div
      className='absolute z-10' // todo display:absolute，父元素在workflow/index.tsx
      style={{
        left: mousePosition.elementX, // 在父元素内部的位置
        top: mousePosition.elementY, // 在父元素内部的位置
        transform: `scale(${zoom})`,
        transformOrigin: '0 0',
      }}
    >
      {
        candidateNode.type === COMMON_NODE && (
          <NodeCommonBase {...candidateNode as any} />
          // <CommonNode {...candidateNode as any} />
        )
      }
      {/* {
        candidateNode.type === CUSTOM_NOTE_NODE && (
          <CustomNoteNode {...candidateNode as any} />
        )
      } */}
    </div>
  )
}

export default memo(CandidateNode)
