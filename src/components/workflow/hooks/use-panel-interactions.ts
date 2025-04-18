import { type MouseEvent, useContext } from 'react'
import { useCallback } from 'react'
import { WorkflowDraftStoreContext } from '../context'

export const usePanelInteractions = () => {
  const workflowStore = useContext(WorkflowDraftStoreContext)!

  const handlePaneContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault() // 防止浏览器默认的右击行为
    const container = document.querySelector('#workflow-container') // 在workflow/index
    const { x, y } = container!.getBoundingClientRect()
    workflowStore.setState({
      panelMenu: {
        top: e.clientY - y,
        left: e.clientX - x,
      },
    })
  }, [workflowStore])

  const handlePaneContextmenuCancel = useCallback(() => {
    workflowStore.setState({
      panelMenu: undefined,
    })
  }, [workflowStore])

  const handleNodeContextmenuCancel = useCallback(() => {
    workflowStore.setState({
      nodeMenu: undefined,
    })
  }, [workflowStore])

  return {
    handlePaneContextMenu,
    handlePaneContextmenuCancel,
    handleNodeContextmenuCancel,
  }
}
