import type { FC } from 'react'
import { memo, useContext } from 'react'
import { useNodes } from 'reactflow'
import { useShallow } from 'zustand/react/shallow'
import type { CommonNodeType } from '../types'
// import { Panel as NodePanel } from '../nodes'
import { Panel as NodePanel } from './node-panel'
import {
  useIsChatMode,
} from '../hooks'
import DebugAndPreview from './debug-and-preview'
// import Record from './record'
import WorkflowPreview from './workflow-preview'
// import ChatRecord from './chat-record'
import ChatVariablePanel from './chat-variable-panel'
import EnvPanel from './env-panel'
// import GlobalVariablePanel from './global-variable-panel'
import cn from '@/utils/classnames'
// import { useStore as useAppStore } from '@/app/components/app/store'
// import MessageLogModal from '@/app/components/base/message-log-modal'
import { useWorkflowDraftStore, WorkflowDraftStoreContext } from '../context'
import { Drawer } from 'antd'

const Panels: FC = () => {
  const nodes = useNodes<CommonNodeType>()
  const isChatMode = useIsChatMode()
  const workflowDraftStore = useContext(WorkflowDraftStoreContext)
  const selectedNode = nodes.find(node => node.data.selected)
  const historyWorkflowData = useWorkflowDraftStore(s => s.historyWorkflowData)
  const showDebugAndPreviewPanel = useWorkflowDraftStore(s => s.showDebugAndPreviewPanel)
  const showEnvPanel = useWorkflowDraftStore(s => s.showEnvPanel) // todo where open
  const showChatVariablePanel = useWorkflowDraftStore(s => s.showChatVariablePanel)
  // const showGlobalVariablePanel = useWorkflowDraftStore(s => s.showGlobalVariablePanel)
  const isRestoring = useWorkflowDraftStore(s => s.isRestoring)
  // const { currentLogItem, setCurrentLogItem, showMessageLogModal, setShowMessageLogModal, currentLogModalActiveTab } = useAppStore(useShallow(state => ({
  //   currentLogItem: state.currentLogItem,
  //   setCurrentLogItem: state.setCurrentLogItem,
  //   showMessageLogModal: state.showMessageLogModal,
  //   setShowMessageLogModal: state.setShowMessageLogModal,
  //   currentLogModalActiveTab: state.currentLogModalActiveTab,
  // }))) // any of them change

  return (
    <div
      tabIndex={-1}
      className={cn('absolute top-14 right-0 bottom-2 flex z-10 outline-none')}
      key={`${isRestoring}`}
    >
      {/* {
        showMessageLogModal && (
          <MessageLogModal
            fixedWidth
            width={400}
            currentLogItem={currentLogItem}
            onCancel={() => {
              setCurrentLogItem()
              setShowMessageLogModal(false)
            }}
            defaultTab={currentLogModalActiveTab}
          />
        )
      } */}
      {
        !!selectedNode && (
          <NodePanel {...selectedNode!} />
        )
      }
      {/* 运行历史，点击记录 */}
      {/* {
        historyWorkflowData && !isChatMode && (
          <Record />
        )
      } */}
      {/* 运行历史，点击记录 */}
      {/* {
        historyWorkflowData && isChatMode && (
          <ChatRecord />
        )
      } */}
      {/* 运行 */}
      {
        showDebugAndPreviewPanel && isChatMode && (
          <DebugAndPreview />
        )
      }
      {/* 运行 */}
      {
        showDebugAndPreviewPanel && !isChatMode && (
          <WorkflowPreview />
        )
      }
      {/* 环境变量 */}
      {showEnvPanel && <Drawer title='环境变量' onClose={()=>{workflowDraftStore.getState().setShowEnvPanel(false)}} open={true}>
        <EnvPanel />
      </Drawer>
      }
      {/* 会话变量 */}
      {
        showChatVariablePanel && <Drawer title='会话变量' onClose={()=>{workflowDraftStore.getState().setShowEnvPanel(false)}} open={true}>
        <ChatVariablePanel />
      </Drawer>
      }
    </div>
  )
}

export default memo(Panels)
