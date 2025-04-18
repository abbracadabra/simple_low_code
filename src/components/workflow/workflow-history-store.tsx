import { createContext } from 'react'
import { create } from 'zustand'
import type { Edge, Node } from './types'
import { type TemporalState, temporal } from 'zundo'
import isDeepEqual from 'fast-deep-equal'
// import type { WorkflowHistoryEvent } from './hooks'

//context
// type WorkflowHistoryStoreContextType = {
//     store?: ReturnType<typeof createStore> | null
//     shortcutsEnabled: boolean
//     setShortcutsEnabled: (enabled: boolean) => void
// }
export type WorkflowDraftHistStore = ReturnType<typeof createStore> | null
export const WorkflowDraftHistStoreContext = createContext<WorkflowDraftHistStore>(null)

//store
export type WorkflowHistoryFields = {
    nodes: Node[]
    edges: Edge[]
    // workflowHistoryEvent: WorkflowHistoryEvent | undefined
}

export type WorkflowHistoryActions = {
    setNodes?: (nodes: Node[]) => void
    setEdges?: (edges: Edge[]) => void
}

// export type WorkflowHistoryStoreApi = StoreApi<WorkflowHistoryState> & { temporal: StoreApi<TemporalState<WorkflowHistoryState>> }
// create shared state
export function createStore({
    nodes: initNodes =[],
    edges: initEdges =[],
}: {
    nodes?: Node[]
    edges?: Edge[]
}) {
    // store.subscribe((state) => {
    // store.getState()、store(state => state.count)
    // store.setState({ ... })  、 store.setState((state) => { ... })  
    const store = create(temporal<WorkflowHistoryFields & WorkflowHistoryActions>(
        (set, get) => {
            return {
                // workflowHistoryEvent: undefined,
                nodes: initNodes,
                edges: initEdges,
                setNodes: (nodes: Node[]) => set({ nodes }),
                setEdges: (edges: Edge[]) => set({ edges }),
            }
        },
        {
            equality: (pastState, currentState) =>
                isDeepEqual(pastState, currentState),
        },
    ),
    )

    return store
}

// export function useWorkflowHistoryStore() {
//     const {store, shortcutsEnabled,setShortcutsEnabled} = useContext(WorkflowHistoryStoreContext)
//     if (store === null)
//         throw new Error('useWorkflowHistoryStoreApi must be used within a WorkflowHistoryProvider')

//     return {
//         store: useMemo(
//             () => ({
//                 getState: store.getState,
//                 setState: (state: WorkflowHistoryState) => {
//                     store.setState({
//                         workflowHistoryEvent: state.workflowHistoryEvent,
//                         nodes: state.nodes.map((node: Node) => ({ ...node, data: { ...node.data, selected: false } })),
//                         edges: state.edges.map((edge: Edge) => ({ ...edge, selected: false }) as Edge),
//                     })
//                 },
//                 subscribe: store.subscribe,
//                 temporal: store.temporal,
//             }),
//             [store],
//         ),
//         // shortcutsEnabled,
//         // setShortcutsEnabled,
//     }
// }

