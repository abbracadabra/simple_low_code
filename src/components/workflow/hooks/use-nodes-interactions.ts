/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MouseEvent } from 'react'
import { useCallback, useRef, useContext } from 'react'
import { useTranslation } from 'react-i18next'
// import { useWorkflowStore } from '../store'
import produce from 'immer'
import { useNodesSyncDraft } from './use-nodes-sync-draft'
import { CUSTOM_NOTE_NODE } from '../note-node/constants'
import { CUSTOM_ITERATION_START_NODE } from '../nodes/iteration-start/constants'
import { useNodeIterationInteractions } from '../nodes/iteration/use-interactions'
import type { IterationNodeType } from '../nodes/iteration/types'
import { COMMON_EDGE, ITERATION_CHILDREN_Z_INDEX, X_OFFSET, Y_OFFSET, NODE_WIDTH_X_OFFSET, ITERATION_PADDING } from '../constants'
import {NODES_EXTRA_INFO, NODES_INITIAL_DATA} from '../nodes/constants'
import { BlockEnum, OnNodeAdd, } from '../types'
import {
    // getNodesConnectedSourceOrTargetHandleIdsMap,
    getTopLeftNodePosition,
    genNewNodeTitleFromOld,
    generateNewNode,
  } from '../utils'
  // import { WorkflowContext } from '@/components/workflow/store' 
import {
    NodeDragHandler,
    NodeMouseHandler,
    getConnectedEdges,
    getOutgoers,
    OnConnectStart,
    OnConnectEnd,
    useReactFlow,
    OnConnect,
    useStoreApi,
    ResizeParamsWithDirection,
  } from 'reactflow'
  import type {
    Edge,
    Node,
  } from '../types'
  import {
    useNodesReadOnly,
    useWorkflow,
    // useWorkflowReadOnly,
  } from './use-workflow'
  import { WorkflowHistoryEvent, useWorkflowHistoryStore } from './use-workflow-history-store'
  // import {WorkflowHistoryStoreContext} from '@/components/workflow/workflow-history-store'
  import { WorkflowDraftStoreContext } from '../context'
// import { NodeTitleMap } from '../nodes'

  /**
   * 操作后同步远端、更新本地历史  handleSyncWorkflowDraft & updateLocalHistory
   * 撤回、重做   handleHistoryBack & handleHistoryForward
   */
export const useNodesInteractions = () => {
    const { t } = useTranslation()
    const store = useStoreApi()
    const workflowStore = useContext(WorkflowDraftStoreContext)!
    // const workflowStore = useWorkflowStore()
    const reactflow = useReactFlow()
    // const {store: workflowHistoryStore} = useContext(WorkflowHistoryStoreContext)
    // const { store: workflowHistoryStore } = useWorkflowHistoryStore()
    const { handleSyncWorkflowDraft } = useNodesSyncDraft() //保存草稿，防抖5秒
    const {
    //   checkNestedParallelLimit, //并行嵌套层数
      getAfterNodesInSameBranch,
    } = useWorkflow()
    const { getNodesReadOnly } = useNodesReadOnly()
    // const { getWorkflowReadOnly } = useWorkflowReadOnly()
    // const { handleSetHelpline } = useHelpline()
    const {
      handleNodeIterationChildDrag,
      handleNodeIterationChildrenCopy,
    } = useNodeIterationInteractions()
    const dragNodeStartPosition = useRef({ x: 0, y: 0 } as { x: number; y: number })
  
    const { updateLocalHistory, undo, redo, getState:getHistState } = useWorkflowHistoryStore() // 保存本地历史，防抖500毫秒

    // 拖动初始
    const handleNodeDragStart = useCallback<NodeDragHandler>((_, node) => {
    //   workflowStore.setState({ nodeAnimation: false })
  
      if (getNodesReadOnly())
        return
  
      if (node.type === CUSTOM_ITERATION_START_NODE || node.type === CUSTOM_NOTE_NODE)
        return
  
      dragNodeStartPosition.current = { x: node.position.x, y: node.position.y }
    }, [workflowStore, getNodesReadOnly])
  
    //实时的拖动事件
    const handleNodeDrag = useCallback<NodeDragHandler>((e, node: Node) => {
      if (getNodesReadOnly()) {
        return
      }
  
      if (node.type === CUSTOM_ITERATION_START_NODE)
        return
  
      const {
        getNodes,
        setNodes,
      } = store.getState()
      e.stopPropagation()
  
      const nodes = getNodes()
  
      const { restrictPosition } = handleNodeIterationChildDrag(node) // 迭代节点子节点限制位置
  
    //   const {
    //     showHorizontalHelpLineNodes,
    //     showVerticalHelpLineNodes,
    //   } = handleSetHelpline(node)
    //   const showHorizontalHelpLineNodesLength = showHorizontalHelpLineNodes.length
    //   const showVerticalHelpLineNodesLength = showVerticalHelpLineNodes.length
  
      const newNodes = produce(nodes, (draft) => {
        const currentNode = draft.find(n => n.id === node.id)!
  
        // if (showVerticalHelpLineNodesLength > 0)
        //   currentNode.position.x = showVerticalHelpLineNodes[0].position.x
        // else 
        if (restrictPosition.x !== undefined)
          currentNode.position.x = restrictPosition.x
        else
          currentNode.position.x = node.position.x
  
        // if (showHorizontalHelpLineNodesLength > 0)
        //   currentNode.position.y = showHorizontalHelpLineNodes[0].position.y
        // else 
        if (restrictPosition.y !== undefined)
          currentNode.position.y = restrictPosition.y
        else
          currentNode.position.y = node.position.y
      })
  
      setNodes(newNodes)
    }, [store, getNodesReadOnly, handleNodeIterationChildDrag])
  
    //拖动结束
    const handleNodeDragStop = useCallback<NodeDragHandler>((_, node) => {
    //   const {
        // setHelpLineHorizontal,
        // setHelpLineVertical,
    //   } = workflowStore.getState()
  
      if (getNodesReadOnly())
        return
  
      const { x, y } = dragNodeStartPosition.current
      if (!(x === node.position.x && y === node.position.y)) {
        // setHelpLineHorizontal()
        // setHelpLineVertical()
        handleSyncWorkflowDraft() // 保存变更
  
        if (x !== 0 && y !== 0) {
          // selecting a note will trigger a drag stop event with x and y as 0
          updateLocalHistory(WorkflowHistoryEvent.NodeDragStop)
        }
      }
    }, [workflowStore, getNodesReadOnly, updateLocalHistory, handleSyncWorkflowDraft])
  
    // 鼠标悬停node上
    const handleNodeEnter = useCallback<NodeMouseHandler>((_, node) => {
    //   if (getNodesReadOnly())
    //     return
  
    //   if (node.type === CUSTOM_NOTE_NODE || node.type === CUSTOM_ITERATION_START_NODE)
    //     return
  
    //   const {
    //     getNodes,
    //     setNodes,
    //     edges,
    //     setEdges,
    //   } = store.getState()
    //   const nodes = getNodes()
    //   const {
    //     connectingNodePayload,
    //     setEnteringNodePayload,
    //   } = workflowStore.getState()
  
    //   if (connectingNodePayload) {
    //     if (connectingNodePayload.nodeId === node.id)
    //       return
    //     const connectingNode: Node = nodes.find(n => n.id === connectingNodePayload.nodeId)!
    //     const sameLevel = connectingNode.parentId === node.parentId
  
    //     if (sameLevel) {
    //       setEnteringNodePayload({
    //         nodeId: node.id,
    //         nodeData: node.data as VariableAssignerNodeType,
    //       })
    //       const fromType = connectingNodePayload.handleType
  
    //       const newNodes = produce(nodes, (draft) => {
    //         draft.forEach((n) => {
    //           if (n.id === node.id && fromType === 'source' && (node.data.type === BlockEnum.VariableAssigner || node.data.type === BlockEnum.VariableAggregator)) {
    //             if (!node.data.advanced_settings?.group_enabled)
    //               n.data._isEntering = true
    //           }
    //           if (n.id === node.id && fromType === 'target' && (connectingNode.data.type === BlockEnum.VariableAssigner || connectingNode.data.type === BlockEnum.VariableAggregator) && node.data.type !== BlockEnum.IfElse && node.data.type !== BlockEnum.QuestionClassifier)
    //             n.data._isEntering = true
    //         })
    //       })
    //       setNodes(newNodes)
    //     }
    //   }
    //   const newEdges = produce(edges, (draft) => {
    //     const connectedEdges = getConnectedEdges([node], edges)
  
    //     connectedEdges.forEach((edge) => {
    //       const currentEdge = draft.find(e => e.id === edge.id)
    //       if (currentEdge)
    //         currentEdge.data._connectedNodeIsHovering = true
    //     })
    //   })
    //   setEdges(newEdges)
    //   const connectedEdges = getConnectedEdges([node], edges).filter(edge => edge.target === node.id)
  
    //   const targetNodes: Node[] = []
    //   for (let i = 0; i < connectedEdges.length; i++) {
    //     const sourceConnectedEdges = getConnectedEdges([{ id: connectedEdges[i].source } as Node], edges).filter(edge => edge.source === connectedEdges[i].source && edge.sourceHandle === connectedEdges[i].sourceHandle)
    //     targetNodes.push(...sourceConnectedEdges.map(edge => nodes.find(n => n.id === edge.target)!))
    //   }
    //   const uniqTargetNodes = unionBy(targetNodes, 'id')
    //   if (uniqTargetNodes.length > 1) {
    //     const newNodes = produce(nodes, (draft) => {
    //       draft.forEach((n) => {
    //         if (uniqTargetNodes.some(targetNode => n.id === targetNode.id))
    //           n.data._inParallelHovering = true
    //       })
    //     })
    //     setNodes(newNodes)
    //   }
    }, [store, workflowStore, getNodesReadOnly])
  
    const handleNodeLeave = useCallback<NodeMouseHandler>((_, node) => {
    //   if (getNodesReadOnly())
    //     return
  
    //   if (node.type === CUSTOM_NOTE_NODE || node.type === CUSTOM_ITERATION_START_NODE)
    //     return
  
    //   const {
    //     setEnteringNodePayload,
    //   } = workflowStore.getState()
    //   setEnteringNodePayload(undefined)
    //   const {
    //     getNodes,
    //     setNodes,
    //     edges,
    //     setEdges,
    //   } = store.getState()
    //   const newNodes = produce(getNodes(), (draft) => {
    //     draft.forEach((node) => {
    //       node.data._isEntering = false
    //       node.data._inParallelHovering = false
    //     })
    //   })
    //   setNodes(newNodes)
    //   const newEdges = produce(edges, (draft) => {
    //     draft.forEach((edge) => {
    //       edge.data._connectedNodeIsHovering = false
    //     })
    //   })
    //   setEdges(newEdges)
    }, [store, workflowStore, getNodesReadOnly])
  
    // 节点框蓝色、打开面板
    const handleNodeSelect = useCallback((nodeId: string, selected: boolean=true) => {
      const {
        getNodes,
        setNodes,
        // edges,
        // setEdges,
      } = store.getState()
  
      const nodes = getNodes()
      const selectedNode = nodes.find(node => node.data.selected)
  
      if (selected && selectedNode?.id === nodeId)
        return
  
      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          if (node.id === nodeId)
            node.data.selected = selected
          else
            node.data.selected = false
        })
      })
      setNodes(newNodes)
  
      // 和它连接的edge也变色, todo 是否可以渲染时算
      // const connectedEdges = getConnectedEdges([{ id: nodeId } as Node], edges).map(edge => edge.id)
      // const newEdges = produce(edges, (draft) => {
      //   draft.forEach((edge) => {
      //     if (connectedEdges.includes(edge.id)) {
      //       edge.data = {
      //         ...edge.data,
      //         _connectedNodeIsSelected: selected,
      //       }
      //     }
      //     else {
      //       edge.data = {
      //         ...edge.data,
      //         _connectedNodeIsSelected: false,
      //       }
      //     }
      //   })
      // })
      // setEdges(newEdges)
  
      handleSyncWorkflowDraft()
    }, [store, handleSyncWorkflowDraft])
  
    const handleNodeClick = useCallback<NodeMouseHandler>((_, node) => {
      if (node.type === CUSTOM_ITERATION_START_NODE)
        return
      handleNodeSelect(node.id, true)
    }, [handleNodeSelect])
  
    // connection released on a handle
    const handleNodeConnect = useCallback<OnConnect>(({
      source, //哪个节点开始拖动连线
      sourceHandle, //连接关系的起
      target, //连线动作的目标节点的 ID
      targetHandle, //连接关系的终
    }) => {
      if (source === target)
        return
      if (getNodesReadOnly())
        return
  
      const {
        getNodes,
        setNodes,
        edges,
        setEdges,
      } = store.getState()
      const nodes = getNodes()
      const targetNode = nodes.find(node => node.id === target!)
      const sourceNode = nodes.find(node => node.id === source!)
  
      if (targetNode?.parentId !== sourceNode?.parentId)
        return
  
      if (sourceNode?.type === CUSTOM_NOTE_NODE || targetNode?.type === CUSTOM_NOTE_NODE)
        return
  
      //线已存在
      if (edges.find(edge => edge.source === source && edge.sourceHandle === sourceHandle && edge.target === target && edge.targetHandle === targetHandle))
        return
  
      const newEdge = {
        id: `${source}-${sourceHandle}-${target}-${targetHandle}`,
        type: COMMON_EDGE,
        source: source!,
        target: target!,
        sourceHandle,
        targetHandle,
        data: {
          sourceType: nodes.find(node => node.id === source)!.data.type,
          targetType: nodes.find(node => node.id === target)!.data.type,
          isInIteration: !!targetNode?.parentId,
          iteration_id: targetNode?.parentId,
        },
        zIndex: targetNode?.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
      }
      //node -> 连着的sourcehandleid  node -> 连着的targethandleid
      // const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(
      //   [
      //     { type: 'add', edge: newEdge },
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
      const newEdges = produce(edges, (draft) => {
        draft.push(newEdge)
      })

    //   if (checkNestedParallelLimit(newNodes, newEdges, targetNode?.parentId)) {
        // setNodes(newNodes)
        setEdges(newEdges)
        handleSyncWorkflowDraft()
        updateLocalHistory(WorkflowHistoryEvent.NodeConnect)
    }, [getNodesReadOnly, store, workflowStore, handleSyncWorkflowDraft, updateLocalHistory])
  
    const handleNodeConnectStart = useCallback<OnConnectStart>((_, { nodeId, handleType, handleId }) => {
    //   if (getNodesReadOnly())
    //     return
  
    //   if (nodeId && handleType) {
    //     const { setConnectingNodePayload } = workflowStore.getState()
    //     const { getNodes } = store.getState()
    //     const node = getNodes().find(n => n.id === nodeId)!
  
    //     if (node.type === CUSTOM_NOTE_NODE)
    //       return
  
    //     if (node.data.type === BlockEnum.VariableAggregator || node.data.type === BlockEnum.VariableAssigner) {
    //       if (handleType === 'target')
    //         return
    //     }
  
    //     setConnectingNodePayload({
    //       nodeId,
    //       nodeType: node.data.type,
    //       handleType,
    //       handleId,
    //     })
    //   }
    }, [store, workflowStore, getNodesReadOnly])
  
    const handleNodeConnectEnd = useCallback<OnConnectEnd>((e: any) => {
    //   if (getNodesReadOnly())
    //     return
  
    //   const {
    //     connectingNodePayload, // 拉线起点节点
    //     setConnectingNodePayload,
    //     enteringNodePayload, // 鼠标hover节点
    //     setEnteringNodePayload,
    //   } = workflowStore.getState()
    //   if (connectingNodePayload && enteringNodePayload) {
    //     const {
    //       setShowAssignVariablePopup,
    //       hoveringAssignVariableGroupId,
    //     } = workflowStore.getState()
    //     const { screenToFlowPosition } = reactflow
    //     const {
    //       getNodes,
    //       setNodes,
    //     } = store.getState()
    //     const nodes = getNodes()
    //     const fromHandleType = connectingNodePayload.handleType
    //     const fromHandleId = connectingNodePayload.handleId
    //     const fromNode = nodes.find(n => n.id === connectingNodePayload.nodeId)!
    //     const toNode = nodes.find(n => n.id === enteringNodePayload.nodeId)!
    //     const toParentNode = nodes.find(n => n.id === toNode.parentId)
  
    //     if (fromNode.parentId !== toNode.parentId)
    //       return
  
    //     const { x, y } = screenToFlowPosition({ x: e.x, y: e.y })
  
    //     if (fromHandleType === 'source' && (toNode.data.type === BlockEnum.VariableAssigner || toNode.data.type === BlockEnum.VariableAggregator)) {
    //       const groupEnabled = toNode.data.advanced_settings?.group_enabled
    //       const firstGroupId = toNode.data.advanced_settings?.groups[0].groupId
    //       let handleId = 'target'
  
    //       if (groupEnabled) {
    //         if (hoveringAssignVariableGroupId)
    //           handleId = hoveringAssignVariableGroupId
    //         else
    //           handleId = firstGroupId
    //       }
    //       const newNodes = produce(nodes, (draft) => {
    //         draft.forEach((node) => {
    //           if (node.id === toNode.id) {
    //             node.data._showAddVariablePopup = true
    //             node.data._holdAddVariablePopup = true
    //           }
    //         })
    //       })
    //       setNodes(newNodes)
    //       setShowAssignVariablePopup({
    //         nodeId: fromNode.id,
    //         nodeData: fromNode.data,
    //         variableAssignerNodeId: toNode.id,
    //         variableAssignerNodeData: toNode.data,
    //         variableAssignerNodeHandleId: handleId,
    //         parentNode: toParentNode,
    //         x: x - toNode.positionAbsolute!.x,
    //         y: y - toNode.positionAbsolute!.y,
    //       })
    //       handleNodeConnect({
    //         source: fromNode.id,
    //         sourceHandle: fromHandleId,
    //         target: toNode.id,
    //         targetHandle: 'target',
    //       })
    //     }
    //   }
    //   setConnectingNodePayload(undefined)
    //   setEnteringNodePayload(undefined)
    }, [store, handleNodeConnect, getNodesReadOnly, workflowStore, reactflow])
  
    const handleNodeDelete = useCallback((nodeId: string) => {
      if (getNodesReadOnly())
        return
  
      const {
        getNodes,
        setNodes,
        edges,
        setEdges,
      } = store.getState()
  
      const nodes = getNodes()
      const currentNodeIndex = nodes.findIndex(node => node.id === nodeId)
      const currentNode = nodes[currentNodeIndex]
  
      if (!currentNode)
        return
  
      // 起点删不掉
      if (currentNode.data.type === BlockEnum.Start)
        return
  
      if (currentNode.data.type === BlockEnum.Iteration) {
        const iterationChildren = nodes.filter(node => node.parentId === currentNode.id)
  
        if (iterationChildren.length) {
        //   if (currentNode.data._isBundled) {
            iterationChildren.forEach((child) => {
              handleNodeDelete(child.id) // 递归
            })
            return handleNodeDelete(nodeId)
        }
      }
      const connectedEdges = getConnectedEdges([{ id: nodeId } as Node], edges)
      // const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(connectedEdges.map(edge => ({ type: 'remove', edge })), nodes)
      const newNodes = produce(nodes, (draft: Node[]) => {
        draft.splice(currentNodeIndex, 1) //删除节点
      })
      setNodes(newNodes)
      const newEdges = produce(edges, (draft) => {
        return draft.filter(edge => !connectedEdges.find(connectedEdge => connectedEdge.id === edge.id))
      })
      setEdges(newEdges) // 删除线
      handleSyncWorkflowDraft()
  
      if (currentNode.type === CUSTOM_NOTE_NODE)
        updateLocalHistory(WorkflowHistoryEvent.NoteDelete)
  
      else
      updateLocalHistory(WorkflowHistoryEvent.NodeDelete)
    }, [getNodesReadOnly, store, handleSyncWorkflowDraft, updateLocalHistory, workflowStore, t])
  
    const handleNodeAdd = useCallback<OnNodeAdd>((
        //要新增节点
        {
          nodeType, // 要新增的节点type
          sourceHandle = 'source', // 注意handle id不是global的，scope是node
          targetHandle = 'target',
          // toolName, // 选的是tool的话，tool_name
          dataExtra={}
        },
        //要新增节点前后节点，src,targ都是edge的src,targ
        {
          prevNodeId,
          prevNodeSourceHandle,
          nextNodeId,
          nextNodeTargetHandle,
        },
      ) => {
        if (getNodesReadOnly())
          return
    
        const {
          getNodes,
          setNodes,
          edges,
          setEdges,
        } = store.getState()
        const nodes = getNodes()
        const nodesWithSameType = nodes.filter(node => node.data.type === nodeType)
        // 新建new node
        const {
          newNode,
          newIterationStartNode, // newNode是迭代节点的话会返回里面的start节点，home图标的
        } = generateNewNode({
          data: {
            ...NODES_INITIAL_DATA[nodeType],
            // 初始节点名字，数字+1
            title: nodesWithSameType.length > 0 ? `${NODES_EXTRA_INFO[nodeType].title} ${nodesWithSameType.length + 1}` : NODES_EXTRA_INFO[nodeType].title,
            ...dataExtra,
            // ...(toolDefaultValue || {}),
            selected: true,
            // _showAddVariablePopup: (nodeType === BlockEnum.VariableAssigner || nodeType === BlockEnum.VariableAggregator) && !!prevNodeId,
            // _holdAddVariablePopup: false,
          },
          position: {
            x: 0,
            y: 0,
          },
        })
        //从节点右侧handle拉线
        if (prevNodeId && !nextNodeId) {
          const prevNodeIndex = nodes.findIndex(node => node.id === prevNodeId)
          const prevNode = nodes[prevNodeIndex]
          const outgoers = getOutgoers(prevNode, nodes, edges).sort((a, b) => a.position.y - b.position.y) // getoutgoer是reactflow的方法，获取连接的右侧nodes
          const lastOutgoer = outgoers[outgoers.length - 1] // 连着的next nodes的最后一个
          
          // newNode.data._connectedTargetHandleIds = [targetHandle] //新节点的inbound handle id
          // newNode.data._connectedSourceHandleIds = [] //新节点的outbound handle id 空
          // 放在已连接的next node的下方
          newNode.position = {
            x: lastOutgoer ? lastOutgoer.position.x : prevNode.position.x + prevNode.width! + X_OFFSET,
            y: lastOutgoer ? lastOutgoer.position.y + lastOutgoer.height! + Y_OFFSET : prevNode.position.y,
          }
          newNode.parentId = prevNode.parentId
          newNode.extent = prevNode.extent
          if (prevNode.parentId) {
            // 在迭代里面新建的节点的parentId不为空
            newNode.data.isInIteration = true
            newNode.data.iteration_id = prevNode.parentId
            newNode.zIndex = ITERATION_CHILDREN_Z_INDEX
          }
    
          //新建new edge
          const newEdge: Edge = {
            id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
            type: COMMON_EDGE,
            source: prevNodeId,
            sourceHandle: prevNodeSourceHandle,
            target: newNode.id,
            targetHandle,
            data: {
              sourceType: prevNode.data.type,
              targetType: newNode.data.type,
              isInIteration: !!prevNode.parentId,
              iteration_id: prevNode.parentId,
            //   _connectedNodeIsSelected: true,
            },
            zIndex: prevNode.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
          }
          const newNodes = produce(nodes, (draft: Node[]) => {
            draft.forEach((node) => {
              node.data.selected = false
            })
            // append to nodes
            draft.push(newNode)
            // 新节点是迭代容器时有newIterationStartNode
            if (newIterationStartNode)
              draft.push(newIterationStartNode)
          })
    
          const newEdges = produce(edges, (draft) => {
            // draft.forEach((item) => {
            //   item.data = {
            //     ...item.data,
            //     // _connectedNodeIsSelected: false,
            //   }
            // })
            draft.push(newEdge)
          })
    
        //   if (checkNestedParallelLimit(newNodes, newEdges, prevNode.parentId)) {
            setNodes(newNodes)
            setEdges(newEdges)
        //   }
        //   else {
        //     return false
        //   }
        }
        // 拉节点左侧的port
        if (!prevNodeId && nextNodeId) {
          const nextNodeIndex = nodes.findIndex(node => node.id === nextNodeId)
          const nextNode = nodes[nextNodeIndex]!
          // if ((nodeType !== BlockEnum.IfElse) && (nodeType !== BlockEnum.QuestionClassifier))
          //   newNode.data._connectedSourceHandleIds = [sourceHandle] //新节点的outbound handle id
          // newNode.data._connectedTargetHandleIds = [] // 新节点的inbound handle id 空
          newNode.position = {
            x: nextNode.position.x,
            y: nextNode.position.y,
          }
          newNode.parentId = nextNode.parentId
          newNode.extent = nextNode.extent
          if (nextNode.parentId) {
            newNode.data.isInIteration = true
            newNode.data.iteration_id = nextNode.parentId
            newNode.zIndex = ITERATION_CHILDREN_Z_INDEX
          }
    
          let newEdge
    
          // if ((nodeType !== BlockEnum.IfElse) && (nodeType !== BlockEnum.QuestionClassifier)) {
          if ((nodeType !== BlockEnum.IfElse)) {
            newEdge = {
              id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
              type: COMMON_EDGE,
              source: newNode.id,
              sourceHandle,
              target: nextNodeId,
              targetHandle: nextNodeTargetHandle,
              data: {
                sourceType: newNode.data.type,
                targetType: nextNode.data.type,
                isInIteration: !!nextNode.parentId,
                iteration_id: nextNode.parentId,
                // _connectedNodeIsSelected: true,
              },
              zIndex: nextNode.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
            }
          }
    
          // 新节点之后的所有节点往后移个位子
          const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!)
          const afterNodesInSameBranchIds = afterNodesInSameBranch.map(node => node.id)
          const newNodes = produce(nodes, (draft) => {
            draft.forEach((node) => {
              node.data.selected = false
    
              if (afterNodesInSameBranchIds.includes(node.id))
                node.position.x += NODE_WIDTH_X_OFFSET
    
              // if (nodesConnectedSourceOrTargetHandleIdsMap?.[node.id]) {
              //   node.data = {
              //     ...node.data,
              //     ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
              //   }
              // }
    
              if (node.data.type === BlockEnum.Iteration && nextNode.parentId === node.id)
                node.data._children?.push(newNode.id)
    
              // if (node.data.type === BlockEnum.Iteration && node.data.start_node_id === nextNodeId) {
              //   node.data.start_node_id = newNode.id
              //   node.data.startNodeType = newNode.data.type
              // }
            })
            draft.push(newNode)
            if (newIterationStartNode)
              draft.push(newIterationStartNode)
          })
          if (newEdge) {
            const newEdges = produce(edges, (draft) => {
            //   draft.forEach((item) => {
            //     item.data = {
            //       ...item.data,
            //     //   _connectedNodeIsSelected: false,
            //     }
            //   })
              draft.push(newEdge)
            })
    
            // if (checkNestedParallelLimit(newNodes, newEdges, nextNode.parentId)) {
              setNodes(newNodes)
              setEdges(newEdges)
            // }
            // else {
            //   return false
            // }
          }
          else {
            // if (checkNestedParallelLimit(newNodes, edges))
              setNodes(newNodes)
    
            // else
            //   return false
          }
        }
        // 在线中间insert节点
        if (prevNodeId && nextNodeId) {
          const prevNode = nodes.find(node => node.id === prevNodeId)!
          const nextNode = nodes.find(node => node.id === nextNodeId)!
    
          // newNode.data._connectedTargetHandleIds = [targetHandle]
          // newNode.data._connectedSourceHandleIds = [sourceHandle]
          newNode.position = {
            x: nextNode.position.x,
            y: nextNode.position.y,
          }
          newNode.parentId = prevNode.parentId
          newNode.extent = prevNode.extent
          if (prevNode.parentId) {
            newNode.data.isInIteration = true
            newNode.data.iteration_id = prevNode.parentId
            newNode.zIndex = ITERATION_CHILDREN_Z_INDEX
          }
    
          const currentEdgeIndex = edges.findIndex(edge => edge.source === prevNodeId && edge.target === nextNodeId)
          const newPrevEdge = {
            id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
            type: COMMON_EDGE,
            source: prevNodeId,
            sourceHandle: prevNodeSourceHandle,
            target: newNode.id,
            targetHandle,
            data: {
              sourceType: prevNode.data.type,
              targetType: newNode.data.type,
              isInIteration: !!prevNode.parentId,
              iteration_id: prevNode.parentId,
            //   _connectedNodeIsSelected: true,
            },
            zIndex: prevNode.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
          }
          let newNextEdge: Edge | null = null
          // if (nodeType !== BlockEnum.IfElse && nodeType !== BlockEnum.QuestionClassifier) {
          if (nodeType !== BlockEnum.IfElse) {
            newNextEdge = {
              id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
              type: COMMON_EDGE,
              source: newNode.id,
              sourceHandle,
              target: nextNodeId,
              targetHandle: nextNodeTargetHandle,
              data: {
                sourceType: newNode.data.type,
                targetType: nextNode.data.type,
                isInIteration: !!nextNode.parentId,
                iteration_id: nextNode.parentId,
                // _connectedNodeIsSelected: true,
              },
              zIndex: nextNode.parentId ? ITERATION_CHILDREN_Z_INDEX : 0,
            }
          }
    
          //后面节点挪后个位置
          const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!)
          const afterNodesInSameBranchIds = afterNodesInSameBranch.map(node => node.id)
          const newNodes = produce(nodes, (draft) => {
            draft.forEach((node) => {
              node.data.selected = false
              if (afterNodesInSameBranchIds.includes(node.id))
                node.position.x += NODE_WIDTH_X_OFFSET
    
              if (node.data.type === BlockEnum.Iteration && prevNode.parentId === node.id)
                node.data._children?.push(newNode.id)
            })
            draft.push(newNode)
            if (newIterationStartNode)
              draft.push(newIterationStartNode)
          })
          setNodes(newNodes)
          const newEdges = produce(edges, (draft) => {
            draft.splice(currentEdgeIndex, 1) //删除原edge
            draft.push(newPrevEdge) //新增
    
            if (newNextEdge)
              draft.push(newNextEdge) //新增
          })
          setEdges(newEdges)
        }
        handleSyncWorkflowDraft() //保存草稿
        updateLocalHistory(WorkflowHistoryEvent.NodeAdd) //图编辑历史
      }, [getNodesReadOnly, store, t, handleSyncWorkflowDraft, updateLocalHistory, workflowStore, getAfterNodesInSameBranch])
  
      //更改节点
    const handleNodeChange = useCallback((
    ) => {
    }, [getNodesReadOnly, store, t, handleSyncWorkflowDraft, updateLocalHistory])
  
    const handleNodeCancelRunningStatus = useCallback(() => {
      const {
        getNodes,
        setNodes,
      } = store.getState()
  
      const nodes = getNodes()
      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          node.data._runningStatus = undefined
        })
      })
      setNodes(newNodes)
    }, [store])
  
    const handleNodesCancelSelected = useCallback(() => {
      const {
        getNodes,
        setNodes,
      } = store.getState()
  
      const nodes = getNodes()
      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          node.data.selected = false
        })
      })
      setNodes(newNodes)
    }, [store])
  
    //右击节点弹出菜单
    const handleNodeContextMenu = useCallback((e: MouseEvent, node: Node) => {
      if (node.type === CUSTOM_NOTE_NODE || node.type === CUSTOM_ITERATION_START_NODE)
        return
  
      e.preventDefault()
      const container = document.querySelector('#workflow-container')
      const { x, y } = container!.getBoundingClientRect()
      workflowStore.setState({
        nodeMenu: {
          top: e.clientY - y,
          left: e.clientX - x,
          nodeId: node.id,
        },
      })
      // handleNodeSelect(node.id)
    }, [workflowStore])
  
    const handleNodesCopy = useCallback((nodeId?: string) => {
      if (getNodesReadOnly())
        return
  
      const { setClipboardElements } = workflowStore.getState()
  
      const {
        getNodes,
      } = store.getState()
  
      const nodes = getNodes()
  
      if (nodeId) {
        // If nodeId is provided, copy that specific node
        const nodeToCopy = nodes.find(node => node.id === nodeId && node.data.type !== BlockEnum.Start && node.type !== CUSTOM_ITERATION_START_NODE)
        if (nodeToCopy)
          setClipboardElements([nodeToCopy])
      }
      else {
        // If no nodeId is provided, fall back to the current behavior
        const bundledNodes = nodes.filter(node => node.data._isBundled && node.data.type !== BlockEnum.Start && !node.data.isInIteration)
  
        // 多选 or 选过程碰到多个但最终只选了一个
        if (bundledNodes.length) {
          setClipboardElements(bundledNodes)
          return
        }
  
        // 选中了个节点
        const selectedNode = nodes.find(node => node.data.selected && node.data.type !== BlockEnum.Start)
  
        if (selectedNode)
          setClipboardElements([selectedNode])
      }
    }, [getNodesReadOnly, store, workflowStore])
  
  
    // ctrl+v
    const handleNodesPaste = useCallback(() => {
      if (getNodesReadOnly())
        return
  
      const {
        clipboardElements,
        mousePosition,
      } = workflowStore.getState()
  
      const {
        getNodes,
        setNodes,
      } = store.getState()
  
      const nodesToPaste: Node[] = []
      const nodes = getNodes()
  
      if (clipboardElements.length) {
        const { x, y } = getTopLeftNodePosition(clipboardElements)
        const { screenToFlowPosition } = reactflow
        const currentPosition = screenToFlowPosition({ x: mousePosition.pageX, y: mousePosition.pageY }) // 鼠标在浏览器位置 转成 鼠标在流程图位置
        const offsetX = currentPosition.x - x
        const offsetY = currentPosition.y - y
        clipboardElements.forEach((nodeToPaste, index) => {
          const nodeType = nodeToPaste.data.type
  
          const {
            newNode,
            newIterationStartNode,
          } = generateNewNode({
            type: nodeToPaste.type,
            data: {
              ...NODES_INITIAL_DATA[nodeType],
              ...nodeToPaste.data,
              selected: false,
              _isBundled: false,
              // _connectedSourceHandleIds: [], // outbound connect handle id
              // _connectedTargetHandleIds: [], // inbound
              title: genNewNodeTitleFromOld(nodeToPaste.data.title),
            },
            position: {
              x: nodeToPaste.position.x + offsetX,
              y: nodeToPaste.position.y + offsetY,
            },
            extent: nodeToPaste.extent,
            zIndex: nodeToPaste.zIndex,
          })
          newNode.id = newNode.id + index
          // This new node is movable and can be placed anywhere
          let newChildren: Node[] = []
          if (nodeToPaste.data.type === BlockEnum.Iteration) {
            newIterationStartNode!.parentId = newNode.id; // 迭代里的开始节点设置parent为迭代节点
            (newNode.data as IterationNodeType).start_node_id = newIterationStartNode!.id //迭代节点的开始节点id设置为迭代开始节点
  
            newChildren = handleNodeIterationChildrenCopy(nodeToPaste.id, newNode.id) // 拷贝迭代内的节点，排除了迭代起始节点
            // newChildren.forEach((child) => {
            //   newNode.data._children?.push(child.id) // 迭代节点的copy.children add child copy
            // })
            newChildren.push(newIterationStartNode!) // 起始节点加入到迭代节点的copy
          }
  
          nodesToPaste.push(newNode)
  
          if (newChildren.length)
            nodesToPaste.push(...newChildren)
        })
  
        setNodes([...nodes, ...nodesToPaste]) // 拷贝节点加到流程图
        updateLocalHistory(WorkflowHistoryEvent.NodePaste) // 本地操作历史
        handleSyncWorkflowDraft() // 同步草稿
      }
    }, [getNodesReadOnly, workflowStore, store, reactflow, updateLocalHistory, handleSyncWorkflowDraft, handleNodeIterationChildrenCopy])
  

    // 菜单-复制
    const handleNodesDuplicate = useCallback((nodeId?: string) => {
      if (getNodesReadOnly())
        return
  
      handleNodesCopy(nodeId)
      handleNodesPaste()
    }, [getNodesReadOnly, handleNodesCopy, handleNodesPaste])
  
    const handleNodesDelete = useCallback(() => {
      if (getNodesReadOnly())
        return
  
      const {
        getNodes,
        edges,
      } = store.getState()
  
      const nodes = getNodes()
      const bundledNodes = nodes.filter(node => node.data._isBundled && node.data.type !== BlockEnum.Start)
  
      if (bundledNodes.length) {
        //圈选的多节点
        bundledNodes.forEach(node => handleNodeDelete(node.id))
        return
      }
  
      // edge删除在use-edge-interactions  handleEdgeDelete
      const edgeSelected = edges.some(edge => edge.selected)
      if (edgeSelected)
        return
  
      const selectedNode = nodes.find(node => node.data.selected && node.data.type !== BlockEnum.Start)
  
      //选择节点，dify只能选一个
      if (selectedNode)
        handleNodeDelete(selectedNode.id)
    }, [store, getNodesReadOnly, handleNodeDelete])
  
    // 只有迭代节点可变大变小
    const handleNodeResize = useCallback((nodeId: string, params: ResizeParamsWithDirection) => {
      if (getNodesReadOnly())
        return
  
      const {
        getNodes,
        setNodes,
      } = store.getState()
      const { x, y, width, height } = params
  
      const nodes = getNodes()
      const currentNode = nodes.find(n => n.id === nodeId)! // 迭代节点
      // const childrenNodes = nodes.filter(n => currentNode.data._children?.includes(n.id)) // 里面的children
      const childrenNodes = nodes.filter(n => n.parentId === currentNode.id) // 里面的children
      let rightNode: Node // 迭代框框里最右节点
      let bottomNode: Node // 迭代框框里最下节点
  
      childrenNodes.forEach((n) => {
        if (rightNode) {
          if (n.position.x + n.width! > rightNode.position.x + rightNode.width!)
            rightNode = n
        }
        else {
          rightNode = n
        }
        if (bottomNode) {
          if (n.position.y + n.height! > bottomNode.position.y + bottomNode.height!)
            bottomNode = n
        }
        else {
          bottomNode = n
        }
      })
  
      if (rightNode! && bottomNode!) {
        if (width < rightNode!.position.x + rightNode.width! + ITERATION_PADDING.right)
          return
        if (height < bottomNode.position.y + bottomNode.height! + ITERATION_PADDING.bottom)
          return
      }
      const newNodes = produce(nodes, (draft) => {
        draft.forEach((n) => {
          if (n.id === nodeId) {
            // 修改迭代框大小
            n.data.width = width
            n.data.height = height
            n.width = width
            n.height = height
            n.position.x = x
            n.position.y = y
          }
        })
      })
      setNodes(newNodes)
      handleSyncWorkflowDraft() // 同步草稿
      updateLocalHistory(WorkflowHistoryEvent.NodeResize) // 本地步骤历史
    }, [getNodesReadOnly, store, handleSyncWorkflowDraft, updateLocalHistory])
  
    // const handleNodeDisconnect = useCallback((nodeId: string) => {
    //   if (getNodesReadOnly())
    //     return
  
    //   const {
    //     getNodes,
    //     setNodes,
    //     edges,
    //     setEdges,
    //   } = store.getState()
    //   const nodes = getNodes()
    //   const currentNode = nodes.find(node => node.id === nodeId)!
    //   const connectedEdges = getConnectedEdges([currentNode], edges)
    //   const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(
    //     connectedEdges.map(edge => ({ type: 'remove', edge })),
    //     nodes,
    //   )
    //   const newNodes = produce(nodes, (draft: Node[]) => {
    //     draft.forEach((node) => {
    //       if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
    //         node.data = {
    //           ...node.data,
    //           ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
    //         }
    //       }
    //     })
    //   })
    //   setNodes(newNodes)
    //   const newEdges = produce(edges, (draft) => {
    //     return draft.filter(edge => !connectedEdges.find(connectedEdge => connectedEdge.id === edge.id))
    //   })
    //   setEdges(newEdges)
    //   handleSyncWorkflowDraft()
    //   saveStateToHistory(WorkflowHistoryEvent.EdgeDelete)
    // }, [store, getNodesReadOnly, handleSyncWorkflowDraft, updateLocalHistory])
  
    const handleHistoryBack = useCallback(() => {
      if (getNodesReadOnly())
        return
  
      const { setEdges, setNodes } = store.getState()
      undo()
  
      const { edges, nodes } = getHistState()
      if (edges.length === 0 && nodes.length === 0)
        return
  
      setEdges(edges)
      setNodes(nodes)
    }, [store, undo, getHistState, getNodesReadOnly])
  
    const handleHistoryForward = useCallback(() => {
      if (getNodesReadOnly())
        return
  
      const { setEdges, setNodes } = store.getState()
      redo()
  
      const { edges, nodes } = getHistState()
      if (edges.length === 0 && nodes.length === 0)
        return
  
      setEdges(edges)
      setNodes(nodes)
    }, [redo, store, getHistState, getNodesReadOnly])
  
    return {
      handleNodeDragStart, // 拖动初始
      handleNodeDrag, // 实时的拖动事件
      handleNodeDragStop, // 拖动结束
      handleNodeEnter, // 鼠标悬停node上
      handleNodeLeave,
      handleNodeSelect, // 节点框蓝色、打开面板
      handleNodeClick, // 节点框蓝色、打开面板
      handleNodeConnect, // connection released on a handle
      handleNodeConnectStart,
      handleNodeConnectEnd,
      handleNodeDelete,
      handleNodeChange,
      handleNodeAdd,
      handleNodeCancelRunningStatus,
      handleNodesCancelSelected,
      handleNodeContextMenu,
      handleNodesCopy,
      handleNodesPaste,
      handleNodesDuplicate,
      handleNodesDelete,
      handleNodeResize,
      // handleNodeDisconnect,
      handleHistoryBack,
      handleHistoryForward,
    }
  }