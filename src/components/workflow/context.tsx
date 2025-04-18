import {
    useRef,
    createContext,
    useContext,
  } from 'react'
  // import { createWorkflowStore, WorkflowContext } from './store'
  import { type WorkflowDraftStore, type Shape } from './store'
  import {
    useStore as useZustandStore,
  } from 'zustand'
  // import  from './store'

// type WorkflowStore = ReturnType<typeof createWorkflowStore>
export const WorkflowDraftStoreContext = createContext<WorkflowDraftStore | null>(null) // react上下文，主要是workflow的setting,元信息

// export const WorkflowContextProvider = ({ children } : { children:  React.ReactNode }) => {
//     const storeRef = useRef<WorkflowStore>()
  
//     if (!storeRef.current)
//       storeRef.current = createWorkflowStore()
  
//     return (
//       <WorkflowStoreContext.Provider value={storeRef.current}>
//         {children}
//       </WorkflowStoreContext.Provider>
//     )
//   }
  

export function useWorkflowDraftStore<T>(selector: (state: Shape) => T): T {
  const store = useContext(WorkflowDraftStoreContext)
  if (!store)
    throw new Error('Missing WorkflowContext.Provider in the tree')

  return useZustandStore(store, selector)
}