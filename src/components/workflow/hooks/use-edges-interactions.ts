import { useCallback } from 'react'
import produce from 'immer'
import type {
    EdgeMouseHandler,
    OnEdgesChange,
  } from 'reactflow'
import {
    useStoreApi,
  } from 'reactflow'
  import type {
    Node,
  } from '../types'
  // import { getNodesConnectedSourceOrTargetHandleIdsMap } from '../utils'
  import { useNodesReadOnly } from './use-workflow'
  import { useWorkflowHistoryStore, WorkflowHistoryEvent } from './use-workflow-history-store'
  import { useNodesSyncDraft } from './use-nodes-sync-draft'

export const useEdgesInteractions = () => {
    const store = useStoreApi()
    const { handleSyncWorkflowDraft } = useNodesSyncDraft()
    const { getNodesReadOnly } = useNodesReadOnly()
    const { updateLocalHistory } = useWorkflowHistoryStore()
  
    // 鼠标滑到线上，线高亮
    const handleEdgeEnter = useCallback<EdgeMouseHandler>((_, edge) => {
      if (getNodesReadOnly())
        return
  
      const {
        edges,
        setEdges,
      } = store.getState()
      const newEdges = produce(edges, (draft) => {
        const currentEdge = draft.find(e => e.id === edge.id)!
  
        currentEdge.data._hovering = true
      })
      setEdges(newEdges)
    }, [store, getNodesReadOnly])
  
    // 取消线高亮
    const handleEdgeLeave = useCallback<EdgeMouseHandler>((_, edge) => {
      if (getNodesReadOnly())
        return
  
      const {
        edges,
        setEdges,
      } = store.getState()
      const newEdges = produce(edges, (draft) => {
        const currentEdge = draft.find(e => e.id === edge.id)!
  
        currentEdge.data._hovering = false
      })
      setEdges(newEdges)
    }, [store, getNodesReadOnly])
  
    // if-else删除条件， 问题分类器删除问题
    const handleEdgeDeleteByDeleteBranch = useCallback((nodeId: string, branchId: string) => {
      if (getNodesReadOnly())
        return
  
      const {
        getNodes,
        setNodes,
        edges,
        setEdges,
      } = store.getState()
      const edgeWillBeDeleted = edges.filter(edge => edge.source === nodeId && edge.sourceHandle === branchId)
  
      if (!edgeWillBeDeleted.length)
        return
  
      // const nodes = getNodes()
      // 新的 node -> outport/srcport  node -> inport/targetport
      // const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(
      //   edgeWillBeDeleted.map(edge => ({ type: 'remove', edge })),
      //   nodes,
      // )
      // const newNodes = produce(nodes, (draft: Node[]) => {
      //   draft.forEach((node) => {
      //     if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
      //       node.data = {
      //         ...node.data,
      //         ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
      //       }
      //     }
      //   })
      // })
      // setNodes(newNodes)
      const newEdges = produce(edges, (draft) => {
        return draft.filter(edge => !edgeWillBeDeleted.find(e => e.id === edge.id))
      })
      setEdges(newEdges)
      handleSyncWorkflowDraft()
      updateLocalHistory(WorkflowHistoryEvent.EdgeDeleteByDeleteBranch)
    }, [getNodesReadOnly, store, handleSyncWorkflowDraft, updateLocalHistory])
  
    // 删除连线
    const handleEdgeDelete = useCallback(() => {
      if (getNodesReadOnly())
        return
  
      const {
        getNodes,
        setNodes,
        edges,
        setEdges,
      } = store.getState()
      const currentEdgeIndex = edges.findIndex(edge => edge.selected)
  
      if (currentEdgeIndex < 0)
        return
      // const currentEdge = edges[currentEdgeIndex]
      // const nodes = getNodes()
      // 新的 node -> outport/srcport  node -> inport/targetport
      // const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(
      //   [
      //     { type: 'remove', edge: currentEdge },
      //   ],
      //   nodes,
      // )
      // const newNodes = produce(nodes, (draft: Node[]) => {
      //   draft.forEach((node) => {
      //     if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
      //       node.data = {
      //         ...node.data,
      //         ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
      //       }
      //     }
      //   })
      // })
      // setNodes(newNodes)
      const newEdges = produce(edges, (draft) => {
        draft.splice(currentEdgeIndex, 1)
      })
      setEdges(newEdges)
      handleSyncWorkflowDraft()
      updateLocalHistory(WorkflowHistoryEvent.EdgeDelete)
    }, [getNodesReadOnly, store, handleSyncWorkflowDraft, updateLocalHistory])
  
    // edge选中/取消选中，edge打标
    const handleEdgesChange = useCallback<OnEdgesChange>((changes) => {
      if (getNodesReadOnly())
        return
  
      const {
        edges,
        setEdges,
      } = store.getState()
  
      const newEdges = produce(edges, (draft) => {
        changes.forEach((change) => {
          if (change.type === 'select')
            draft.find(edge => edge.id === change.id)!.selected = change.selected
        })
      })
      setEdges(newEdges)
    }, [store, getNodesReadOnly])
  
    // edge取消运行时的上色，测试聊天面板关闭，重置时会调
    const handleEdgeCancelRunningStatus = useCallback(() => {
      const {
        edges,
        setEdges,
      } = store.getState()
  
      const newEdges = produce(edges, (draft) => {
        draft.forEach((edge) => {
          edge.data._sourceRunningStatus = undefined // 线左边节点的测试运行状态，和颜色有关，可以看到测试运行时执行路径上的节点和线颜色改变
          edge.data._targetRunningStatus = undefined // 线右边节点的测试运行状态
        //   edge.data._waitingRun = false // waitrun加点透明，在running则完全不透明
        })
      })
      setEdges(newEdges)
    }, [store])
  
    return {
      handleEdgeEnter,
      handleEdgeLeave,
      handleEdgeDeleteByDeleteBranch,
      handleEdgeDelete,
      handleEdgesChange,
      handleEdgeCancelRunningStatus,
    }
  }