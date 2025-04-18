import {
    useCallback,
    useRef, 
    useContext
  } from 'react'
  import {
    useStoreApi,
  } from 'reactflow'
  import { debounce } from 'lodash-es'
  // import { useTranslation } from 'react-i18next'
  import {WorkflowDraftHistStoreContext} from '@/components/workflow/workflow-history-store'


/**
 * All supported Events that create a new history state.
 * Current limitations:
 * - InputChange events in Node Panels do not trigger state changes.
 * - Resizing UI elements does not trigger state changes.
 */
export enum WorkflowHistoryEvent {
    NodeTitleChange = 'NodeTitleChange',
    NodeDescriptionChange = 'NodeDescriptionChange',
    NodeDragStop = 'NodeDragStop',
    NodeChange = 'NodeChange',
    NodeConnect = 'NodeConnect',
    NodePaste = 'NodePaste',
    NodeDelete = 'NodeDelete',
    EdgeDelete = 'EdgeDelete',
    EdgeDeleteByDeleteBranch = 'EdgeDeleteByDeleteBranch',
    NodeAdd = 'NodeAdd',
    NodeResize = 'NodeResize',
    NoteAdd = 'NoteAdd',
    NoteChange = 'NoteChange',
    NoteDelete = 'NoteDelete',
    LayoutOrganize = 'LayoutOrganize',
  }
  

export const useWorkflowHistoryStore = () => {
    const store = useStoreApi() //reactflow的
    const workflowHistoryStore = useContext(WorkflowDraftHistStoreContext)
    if (!workflowHistoryStore) {
      throw new Error('useWorkflowHistoryStoreApi must be used within a WorkflowHistoryProvider')
    }

    const undo = useCallback(() => {
        workflowHistoryStore.temporal.getState().undo()
        // undoCallbacks.forEach(callback => callback())
      }, [workflowHistoryStore.temporal])
    
      const redo = useCallback(() => {
        workflowHistoryStore.temporal.getState().redo()
        // redoCallbacks.forEach(callback => callback())
      }, [workflowHistoryStore.temporal])

    // 防抖，500毫秒
    const saveStateToHistoryRef = useRef(debounce((event: WorkflowHistoryEvent) => {
        workflowHistoryStore.setState({
        nodes: store.getState().getNodes(),
        edges: store.getState().edges,
        })
    }, 500))
      
    // 本地步骤历史，会防抖
    const updateLocalHistory = useCallback((event: WorkflowHistoryEvent) => {
        switch (event) {
          case WorkflowHistoryEvent.NoteChange:
            // Hint: Note change does not trigger when note text changes,
            // because the note editors have their own history states.
            saveStateToHistoryRef.current(event)
            break
          case WorkflowHistoryEvent.NodeTitleChange:
          case WorkflowHistoryEvent.NodeDescriptionChange:
          case WorkflowHistoryEvent.NodeDragStop:
          case WorkflowHistoryEvent.NodeChange:
          case WorkflowHistoryEvent.NodeConnect:
          case WorkflowHistoryEvent.NodePaste:
          case WorkflowHistoryEvent.NodeDelete:
          case WorkflowHistoryEvent.EdgeDelete:
          case WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
          case WorkflowHistoryEvent.NodeAdd:
          case WorkflowHistoryEvent.NodeResize:
          case WorkflowHistoryEvent.NoteAdd:
          case WorkflowHistoryEvent.LayoutOrganize:
          case WorkflowHistoryEvent.NoteDelete:
            saveStateToHistoryRef.current(event)
            break
          default:
            // We do not create a history state for every event.
            // Some events of reactflow may change things the user would not want to undo/redo.
            // For example: UI state changes like selecting a node.
            break
        }
      }, [])

  return {
    store: workflowHistoryStore,
    updateLocalHistory,
    // getHistoryLabel,
    undo,
    redo,
    getState: () => workflowHistoryStore.getState(),
    // onUndo,
    // onRedo,
  }
}
