import { useReactFlow } from 'reactflow'
import { useKeyPress } from 'ahooks'
import { useCallback, useContext } from 'react'
import {
  getKeyboardKeyCodeBySystem,
  isEventTargetInputArea,
} from '../utils'
// import { useWorkflowHistoryStore } from '../workflow-history-store'
import {
  useEdgesInteractions,
  useNodesInteractions,
} from '.'
import { useWorkflowDraftStore, WorkflowDraftStoreContext } from '../context'

export const useShortcuts = (): void => {
  const {
    handleNodesCopy,
    handleNodesPaste,
    // handleNodesDuplicate,
    handleNodesDelete,
    handleHistoryBack,
    handleHistoryForward,
  } = useNodesInteractions()
  // const { handleStartWorkflowRun } = useWorkflowStartRun()
  const workflowHistoryShortcutsEnabled = useWorkflowDraftStore(s=>s.shortcutsEnabled)
  // const { handleSyncWorkflowDraft } = useNodesSyncDraft()
  const { handleEdgeDelete } = useEdgesInteractions()
  const workflowStore = useContext(WorkflowDraftStoreContext)

  const {
    zoomTo,
    getZoom,
    fitView,
  } = useReactFlow()

  // Zoom out to a minimum of 0.5 for shortcut
  // const constrainedZoomOut = () => {
  //   const currentZoom = getZoom()
  //   const newZoom = Math.max(currentZoom - 0.1, 0.5)
  //   zoomTo(newZoom)
  // }

  // Zoom in to a maximum of 1 for shortcut
  // const constrainedZoomIn = () => {
  //   const currentZoom = getZoom()
  //   const newZoom = Math.min(currentZoom + 0.1, 1)
  //   zoomTo(newZoom)
  // }

  const shouldHandleShortcut = useCallback((e: KeyboardEvent) => {
    // const { showFeaturesPanel } = workflowStore.getState()
    return !isEventTargetInputArea(e.target as HTMLElement) // 输入控件内不可
  }, [workflowStore])

  // 没第三个参数，默认在document上
  useKeyPress(['delete', 'backspace'], (e) => {
    if (shouldHandleShortcut(e)) {
      e.preventDefault()
      handleNodesDelete()
      handleEdgeDelete()
    }
  })

  useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.c`, (e) => {
    const { showDebugAndPreviewPanel } = workflowStore.getState()
    if (shouldHandleShortcut(e) && !showDebugAndPreviewPanel) {
      e.preventDefault()
      handleNodesCopy()
    }
  }, { exactMatch: true, useCapture: true })

  useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.v`, (e) => {
    const { showDebugAndPreviewPanel } = workflowStore.getState()
    if (shouldHandleShortcut(e) && !showDebugAndPreviewPanel) {
      e.preventDefault()
      handleNodesPaste()
    }
  }, { exactMatch: true, useCapture: true })

  // useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.d`, (e) => {
  //   if (shouldHandleShortcut(e)) {
  //     e.preventDefault()
  //     handleNodesDuplicate()
  //   }
  // }, { exactMatch: true, useCapture: true })

  // useKeyPress(`${getKeyboardKeyCodeBySystem('alt')}.r`, (e) => {
  //   if (shouldHandleShortcut(e)) {
  //     e.preventDefault()
  //     handleStartWorkflowRun()
  //   }
  // }, { exactMatch: true, useCapture: true })

  // 撤回
  useKeyPress(`${getKeyboardKeyCodeBySystem('ctrl')}.z`, (e) => {
    const { showDebugAndPreviewPanel } = workflowStore.getState()
    if (shouldHandleShortcut(e) && !showDebugAndPreviewPanel) {
      e.preventDefault()
      workflowHistoryShortcutsEnabled && handleHistoryBack()
    }
  }, { exactMatch: true, useCapture: true })

  // 重做
  useKeyPress(
    `${getKeyboardKeyCodeBySystem('ctrl')}.shift.z`,
    (e) => {
      if (shouldHandleShortcut(e)) {
        e.preventDefault()
        workflowHistoryShortcutsEnabled && handleHistoryForward()
      }
    },
    { exactMatch: true, useCapture: true },
  )

  useKeyPress("shift", (event) => {
    if (event.type === "keydown") {
      workflowStore.getState().setIsShiftPressed(true);
    }
    if (event.type === "keyup") {
      workflowStore.getState().setIsShiftPressed(false);
    }
  },
  {
    events: ["keydown", "keyup"], // Listen for both keydown and keyup
  });
}
