'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  SelectionMode,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { createStore as createHistStore, WorkflowDraftHistStore } from '@/components/workflow/workflow-history-store'
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { FC } from 'react'
import { CUSTOM_ITERATION_START_NODE } from './nodes/iteration-start/constants'
import CustomIterationStartNode from './nodes/iteration-start'
import CommonEdge from './common-edge'
import {
  useNodesInteractions,
  useEdgesInteractions,
  useWorkflowDraftInit,
  useSelectionInteractions,
  usePanelInteractions,
  useNodesReadOnly,
  useWorkflow,
  useShortcuts,
} from './hooks'
import {
  ControlMode,
  type Edge,
  type Node,
} from './types'
import {
  COMMON_NODE,
  COMMON_EDGE,
  ITERATION_CHILDREN_Z_INDEX,
} from './constants'
// import CommonNode from './nodes'
import NodeCommonBase from './nodes/node-base'
import type { WorkflowDraftStore } from './store'
import { createWorkflowDraftStore } from './store'
import { useWorkflowDraftStore, WorkflowDraftStoreContext } from './context'
import { WorkflowDraftHistStoreContext } from './workflow-history-store'
import { Spin } from 'antd';
import type {
  Viewport,
} from 'reactflow'
import { useEventListener } from 'ahooks'
import CandidateNode from './candidate-node'
import Operator from './operator'
import Panels from './panels'

const nodeTypes = {
  [COMMON_NODE]: NodeCommonBase, // 绝大部分节点，有title、handle、打开panel
  // [CUSTOM_NOTE_NODE]: CustomNoteNode, // 注释
  [CUSTOM_ITERATION_START_NODE]: CustomIterationStartNode, // 迭代框里的开始节点。没有title，没有左handle，不打开panel，所以搞个特殊类型，特殊渲染
}
const edgeTypes = {
  [COMMON_EDGE]: CommonEdge,
}

// app/components/workflow/index
type WorkflowProps = {
  nodes: Node[]
  edges: Edge[]
  viewport?: Viewport
}

// reactflow
const Workflow: FC<WorkflowProps> = memo((props) => {

  const workflowContainerRef = useRef<HTMLDivElement>(null)
  const workflowStore = useContext(WorkflowDraftStoreContext)!
  const isShiftPressed = useWorkflowDraftStore(s=>s.isShiftPressed)

  const { nodes: originalNodes, edges: originalEdges, viewport } = props
  const controlMode = useWorkflowDraftStore(s => s.controlMode)
  // workflow里的nodes是没有handle的，handle是在渲染时定义的，见_base/node.tsx中srchandle,trghandle
  const [nodes, setNodes] = useNodesState(originalNodes) // 通过useStoreApi来setNodes不会触发刷新
  const [edges, setEdges] = useEdgesState(originalEdges) // 通过useStoreApi来setNodes不会触发刷新

  const { nodesReadOnly } = useNodesReadOnly()

  // 缺失第三个参数，默认在document上
  useEventListener('mousemove', (e) => {
    const containerClientRect = workflowContainerRef.current?.getBoundingClientRect()
    if (containerClientRect) {
      workflowStore.setState({
        mousePosition: {
          pageX: e.clientX, // 浏览器窗口内位置
          pageY: e.clientY, // 浏览器窗口内位置
          elementX: e.clientX - containerClientRect.left, // 元素内部位置
          elementY: e.clientY - containerClientRect.top, // 元素内部位置
        },
      })
    }
  })

  const {
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
    handleNodeEnter,
    handleNodeLeave,
    handleNodeClick,
    handleNodeConnect,
    handleNodeConnectStart,
    handleNodeConnectEnd,
    handleNodeContextMenu,
    handleHistoryBack,
    handleHistoryForward,
  } = useNodesInteractions()
  const {
    handleEdgeEnter,
    handleEdgeLeave,
    handleEdgesChange,
  } = useEdgesInteractions()
  const {
    handleSelectionStart,
    handleSelectionChange,
    handleSelectionDrag,
  } = useSelectionInteractions()
  const {
    handlePaneContextMenu,
  } = usePanelInteractions()
  const {
    isValidConnection,
  } = useWorkflow()

  useShortcuts()

  // relative positioning, absolute positioned children move with it
  return <div id='workflow-container'
    className={`relative w-full min-w-[960px] h-full`}
    // style={{ width: '100%', height: '100%', position: 'relative' }}  
    // onKeyDown={handleKeyDown}
    // onKeyUp={handleKeyUp}
    ref={workflowContainerRef}>
    {/* 候选节点 */}
    <CandidateNode />
    {/* 节点面板 todo */}
    <Panels />
    {/* 左下角的一些redo undo zoom  之类的小组件 */}
    <Operator handleRedo={handleHistoryForward} handleUndo={handleHistoryBack} />
    <ReactFlow
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes} // 线连上后的渲染
      nodes={nodes}
      edges={edges}
      onNodeDragStart={handleNodeDragStart}
      onNodeDrag={handleNodeDrag}
      onNodeDragStop={handleNodeDragStop}
      onNodeMouseEnter={handleNodeEnter}
      onNodeMouseLeave={handleNodeLeave}
      onNodeClick={handleNodeClick}
      onNodeContextMenu={handleNodeContextMenu} // 右击节点
      onConnect={handleNodeConnect}
      onConnectStart={handleNodeConnectStart}
      onConnectEnd={handleNodeConnectEnd}
      onEdgeMouseEnter={handleEdgeEnter}
      onEdgeMouseLeave={handleEdgeLeave}
      onEdgesChange={handleEdgesChange}
      onSelectionStart={handleSelectionStart} // 圈选选之前
      onSelectionChange={handleSelectionChange}
      onSelectionDrag={handleSelectionDrag}
      onPaneContextMenu={handlePaneContextMenu} // 在画布空白区域右击，其他onEdgeContextMenu，onNodeContextMenu
      // connectionLineComponent={CustomConnectionLine} // 拽线时的临时连线渲染,发现注释掉后连线效果一样
      connectionLineContainerStyle={{ zIndex: ITERATION_CHILDREN_Z_INDEX }}
      defaultViewport={viewport}
      multiSelectionKeyCode={null}
      deleteKeyCode={null}
      nodesDraggable={!nodesReadOnly} // 
      nodesConnectable={!nodesReadOnly}
      nodesFocusable={true} // accessibility by keyboard, move by arrow, focus by Tab, select by Enter. https://reactflow.dev/learn/advanced-use/accessibility
      edgesFocusable={true}
      panOnDrag={controlMode === ControlMode.mouse && !isShiftPressed} // 按住左键并移动鼠标，画布移动
      selectionOnDrag={controlMode === ControlMode.pad || isShiftPressed}
      zoomOnScroll={controlMode === ControlMode.mouse} // 鼠标滚轮缩放  https://reactflow.dev/examples/interaction/interaction-props
      panOnScroll={controlMode === ControlMode.pad} //移动画布，touchpad时scroll指的是四个方向都能动
      zoomOnPinch={true}
      zoomOnDoubleClick={true}
      isValidConnection={isValidConnection}
      selectionKeyCode={null}
      selectionMode={SelectionMode.Partial}
      // panOnScroll 移动画布，touchpad时scroll指的是四个方向都能动
      // selectionOnDrag={controlMode === ControlMode.Pointer} // 按住左键并移动鼠标，框选，画布不移动。查看历史时，因为mode自动变成拳头了，所以这边是false
      minZoom={0.25}
    >
      <Background
        gap={[14, 14]}
        size={2}
        color='#E4E5E7'
      />
    </ReactFlow>
  </div>
})
Workflow.displayName = 'Workflow'

const WorkflowInitializer = (props: any) => {

  const {
    initNodes,
    initEdges,
  } = useWorkflowDraftInit()

  if (!initNodes) {
    return <Spin />
  }
  return <Workflow nodes={initNodes} edges={initEdges}></Workflow>
}

const WorkflowContainer = memo(() => {
  const workflowStoreRef = useRef<WorkflowDraftStore>()
  if (!workflowStoreRef.current)
    workflowStoreRef.current = createWorkflowDraftStore()

  const workflowHistStoreRef = useRef<WorkflowDraftHistStore>()
  if (!workflowHistStoreRef.current)
    workflowHistStoreRef.current = createHistStore({})

  return (
    <ReactFlowProvider>
      <WorkflowDraftStoreContext.Provider value={workflowStoreRef.current}>
        <WorkflowDraftHistStoreContext.Provider value={workflowHistStoreRef.current}>
          <WorkflowInitializer />
        </WorkflowDraftHistStoreContext.Provider>
      </WorkflowDraftStoreContext.Provider>
    </ReactFlowProvider>)
})

export default WorkflowContainer




// const nodess = [
//   {
//     id: '1',
//     position: { x: 0, y: 0 },
//     data: { label: 'Draggable Node' },
//     draggable: true,
//   },
// ];