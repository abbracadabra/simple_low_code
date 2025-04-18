import { useStore as useAppStore } from '@/components/app/store'
import {
  useWorkflowDraftStore,
  WorkflowDraftStoreContext,
  // useWorkflowStore,
} from '../context'
import { uniqBy } from 'lodash-es'
import { type WorkflowDraftStore } from '../store'
import {
  WorkflowRunningStatus,
  BlockEnum,
  Node,
} from '../types'
// import {
//   useStore as useZustandStore,
// } from 'zustand'
import {
  SUPPORT_OUTPUT_VARS_NODE,
} from '../constants'
import {
  useCallback,
  useContext,
  // useMemo,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  useStoreApi,
  getOutgoers,
  Connection,
  getIncomers,
} from 'reactflow'
import {
  fetchAllTools,
} from '@/services/tools'
import type {
  Edge,
} from '../types'
import {
  fetchWorkflowDraft,
  syncWorkflowDraft,
} from '@/services/workflow'
import { useWorkflowTemplate } from './use-workflow-template'
import type { FetchWorkflowDraftResponse } from '@/types/workflow'
import { initialEdges, initialNodes } from '../utils'
import { WorkflowDraftHistStoreContext } from '../workflow-history-store'
import { NODES_EXTRA_INFO } from '../nodes/constants'
import { AppMode } from '@/types/app'

// 是否chatflow
export const useIsChatMode = () => {
  const appDetail = useAppStore(s => s.appDetail)
  
  return appDetail?.mode === AppMode.chatflow
}

export const useWorkflow = () => {
  const store = useStoreApi() //reactflow的， 获取edges,nodes
  const chatMode = useIsChatMode()

  // 这个节点之前所连接的节点，以及他们连接的之前节点，不断下去
  const getBeforeNodesInSameBranch = useCallback((nodeId: string, newNodes?: Node[], newEdges?: Edge[]) => {
    const {
      getNodes,
      edges,
    } = store.getState()
    const nodes = newNodes || getNodes()
    const currentNode = nodes.find(node => node.id === nodeId)

    const list: Node[] = []

    if (!currentNode)
      return list

    if (currentNode.parentId) {
      const parentNode = nodes.find(node => node.id === currentNode.parentId)
      if (parentNode) {
        const parentList = getBeforeNodesInSameBranch(parentNode.id)

        list.push(...parentList)
      }
    }

    const traverse = (root: Node, callback: (node: Node) => void) => {
      if (root) {
        const incomers = getIncomers(root, nodes, newEdges || edges)

        if (incomers.length) {
          incomers.forEach((node) => {
            if (!list.find(n => node.id === n.id)) {
              callback(node)
              traverse(node, callback)
            }
          })
        }
      }
    }
    traverse(currentNode, (node) => {
      list.push(node)
    })

    const length = list.length
    if (length) {
      return uniqBy(list, 'id').reverse().filter((item) => {
        return SUPPORT_OUTPUT_VARS_NODE.includes(item.data.type)
      })
    }

    return []
  }, [store])

  // 这个节点它后面所连接的节点，以及他们连接的后面节点，不断下去
  const getAfterNodesInSameBranch = useCallback((nodeId: string) => {
    const {
      getNodes,
      edges,
    } = store.getState()
    const nodes = getNodes()
    const currentNode = nodes.find(node => node.id === nodeId)!

    if (!currentNode)
      return []
    const list: Node[] = [currentNode]

    const traverse = (root: Node, callback: (node: Node) => void) => {
      if (root) {
        const outgoers = getOutgoers(root, nodes, edges)

        if (outgoers.length) {
          outgoers.forEach((node) => {
            callback(node)
            traverse(node, callback)
          })
        }
      }
    }
    traverse(currentNode, (node) => {
      list.push(node)
    })

    return uniqBy(list, 'id')
  }, [store])

  const isValidConnection = useCallback(({ source, sourceHandle, target }: Connection) => {
    const {
      edges,
      getNodes,
    } = store.getState()
    const nodes = getNodes()
    const sourceNode: Node = nodes.find(node => node.id === source)!
    const targetNode: Node = nodes.find(node => node.id === target)!

    if (sourceNode.parentId !== targetNode.parentId)
      return false

    if (sourceNode && targetNode) {
      const sourceNodeAvailableNextNodes = NODES_EXTRA_INFO[sourceNode.data.type].getValidNextNodes(chatMode,!!sourceNode.parentId) // availableNextNodes是选择器里能选的元素
      const targetNodeAvailablePrevNodes = NODES_EXTRA_INFO[sourceNode.data.type].getValidPrevNodes(chatMode,!!targetNode.parentId)

      if (!sourceNodeAvailableNextNodes.includes(targetNode.data.type))
        return false

      if (!targetNodeAvailablePrevNodes.includes(sourceNode.data.type))
        return false
    }

    const hasCycle = (node: Node, visited = new Set()) => {
      if (visited.has(node.id))
        return false

      visited.add(node.id)

      for (const outgoer of getOutgoers(node, nodes, edges)) {
        if (outgoer.id === source)
          return true
        if (hasCycle(outgoer, visited))
          return true
      }
    }

    return !hasCycle(targetNode)
  }, [store])
  return {
    getBeforeNodesInSameBranch,
    getAfterNodesInSameBranch,
    isValidConnection,
  }
}

export const useNodesReadOnly = () => {
  const workflowStore = useContext(WorkflowDraftStoreContext)!
  // const workflowStore = useWorkflowStore()
  const workflowRunningData = useWorkflowDraftStore(s => s.workflowRunningData)
  // const historyWorkflowData = useStore(s => s.historyWorkflowData) //在展示运行历史的flow
  const readonly = useWorkflowDraftStore(s => s.readonly) //在展示历史发布版本

  const getNodesReadOnly = useCallback(() => {
    const {
      workflowRunningData,
      readonly, 
    } = workflowStore.getState()
    return readonly || workflowRunningData?.result.status === WorkflowRunningStatus.Running
  }, [workflowStore])

  return {
    nodesReadOnly: !!(readonly || workflowRunningData?.result.status === WorkflowRunningStatus.Running),
    getNodesReadOnly,
  }
}

export const useWorkflowDraftInit = () => {
  const appDetail = useAppStore(state => state.appDetail)!
  const workflowStore = useContext(WorkflowDraftStoreContext)
  const workflowHistoryStore = useContext(WorkflowDraftHistStoreContext)
  const appId = appDetail.id

  const [data, setData] = useState<FetchWorkflowDraftResponse>()

  // 查草稿数据
  useEffect(() => {
    workflowStore.setState({ appId })
    handleGetInitialWorkflowData()
  }, [appId])

  const initData = useMemo(() => {
    if (!data) {
      return {}
    }
    workflowStore.getState().setDraftUpdatedAt(data.updated_at)
    const initNodes = initialNodes(data.graph.nodes, data.graph.edges)
    const initEdges = initialEdges(data.graph.edges, data.graph.nodes)
    workflowHistoryStore.setState({
      nodes: initNodes,
      edges: initEdges,
    })
    return { initNodes, initEdges }
  }, [data])
  
  const {
    nodes: nodesTemplate,
    edges: edgesTemplate,
  } = useWorkflowTemplate()

  const handleGetInitialWorkflowData = async () => {
    try {
      const res = await fetchWorkflowDraft(`/apps/${appId}/workflows/draft`)
      setData(res)
      workflowStore.setState({
        environmentVariables: res.environment_variables || [],
        // #TODO chatVar sync#
        conversationVariables: res.conversation_variables || [],
      })
    } catch (err: any) {
      if (err.code === 'draft_workflow_not_exist') {
        workflowStore.setState({ notInitialWorkflow: true })
        syncWorkflowDraft({
          url: `/apps/${appId}/workflows/draft`,
          params: {
            graph: {
              nodes: nodesTemplate,
              edges: edgesTemplate,
            },
            features: {
              retriever_resource: { enabled: true },
            },
            environment_variables: [],
            conversation_variables: [],
          },
        }).then((res) => {
          workflowStore.getState().setDraftUpdatedAt(res.updated_at)
          handleGetInitialWorkflowData()
        })
      }
    }
  }
  return initData
}
  
export const useNodeInfo = (nodeId: string) => {
  const store = useStoreApi()
  const {
    getNodes,
  } = store.getState()
  const allNodes = getNodes()
  const node = allNodes.find(n => n.id === nodeId)
  return node
}