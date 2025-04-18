import {
    memo,
    useCallback,
    useMemo,
    useState,
  } from 'react'
import type { EdgeProps } from 'reactflow'
import {
    BaseEdge,
    EdgeLabelRenderer,
    Position,
    getBezierPath,
  } from 'reactflow'
  import { intersection } from 'lodash-es'
  import {
    useValidBlocks,
    useNodesInteractions,
  } from './hooks'
  import BlockSelector from './block-selector'
  import type {
    Edge,
    OnSelectBlock,
  } from './types'
  import cn from '@/utils/classnames'
  import { getEdgeColor } from './utils'
  import { NodeRunningStatus } from './types'
  import { ITERATION_CHILDREN_Z_INDEX } from './constants'

// EdgeProps为reactflow自定义组件的入参参数
const CommonEdge = ({
    id,
    data,
    source,
    sourceHandleId,
    target,
    targetHandleId,
    sourceX,
    sourceY,
    targetX,
    targetY,
    selected,
  }: EdgeProps) => {
    const [
      edgePath, // 线路径
      labelX, // label位置
      labelY,
    ] = getBezierPath({
      sourceX: sourceX - 8,
      sourceY,
      sourcePosition: Position.Right,
      targetX: targetX + 8,
      targetY,
      targetPosition: Position.Left,
      curvature: 0.16,
    })
    // const [open, setOpen] = useState(false)
    const { handleNodeAdd } = useNodesInteractions()
    const { validPrevBlocks: availablePrevBlocks } = useValidBlocks((data as Edge['data'])!.targetType, (data as Edge['data'])?.isInIteration)//终点节点的prev可选节点
    const { validNextBlocks: availableNextBlocks } = useValidBlocks((data as Edge['data'])!.sourceType, (data as Edge['data'])?.isInIteration)//起点节点的next可选节点
    // const {
    //   _sourceRunningStatus,
    //   _targetRunningStatus,
    // } = data
  
    // const linearGradientId = useMemo(() => {
    //   if (
    //     (
    //       _sourceRunningStatus === NodeRunningStatus.Succeeded
    //       || _sourceRunningStatus === NodeRunningStatus.Failed
    //       || _sourceRunningStatus === NodeRunningStatus.Exception
    //     ) && (
    //       _targetRunningStatus === NodeRunningStatus.Succeeded
    //       || _targetRunningStatus === NodeRunningStatus.Failed
    //       || _targetRunningStatus === NodeRunningStatus.Exception
    //       || _targetRunningStatus === NodeRunningStatus.Running
    //     )
    //   )
    //     return id
    // }, [_sourceRunningStatus, _targetRunningStatus, id])
  
    // const handleOpenChange = useCallback((v: boolean) => {
    //   setOpen(v)
    // }, [])
  
    const handleInsert = useCallback<OnSelectBlock>((nodeType, dataExtra) => {
      handleNodeAdd(
        {
          nodeType,
          dataExtra
        },
        {
          prevNodeId: source,
          prevNodeSourceHandle: sourceHandleId || 'source',
          nextNodeId: target,
          nextNodeTargetHandle: targetHandleId || 'target',
        },
      )
    }, [handleNodeAdd, source, sourceHandleId, target, targetHandleId])
  
    // svg里图形的stroke属性
    const stroke = useMemo(() => {
      if (selected)
        return getEdgeColor(NodeRunningStatus.Running)
  
      // 工作流测试时running的edge进的分支，edge颜色渐变，用svg stoke pattern，在下面CustomEdgeLinearGradientRender定义pattern，linearGradientId是pattern的id
    //   if (linearGradientId)
    //     return `url(#${linearGradientId})`

      if (data?._connectedNodeIsHovering || data?._run)
        return getEdgeColor(NodeRunningStatus.Running)
  
      return getEdgeColor()
    }, [data._connectedNodeIsHovering, selected, sourceHandleId])
  
    return (
      <>
        {/* {
            // 定义stroke pattern，与上面`if (linearGradientId)`对应，Pattern stroking：https://developer.mozilla.org/en-US/docs/Web/CSS/stroke#pattern_stroking
          linearGradientId && (
            <CustomEdgeLinearGradientRender
              id={linearGradientId}
              startColor={getEdgeColor(_sourceRunningStatus)}
              stopColor={getEdgeColor(_targetRunningStatus)}
              position={{
                x1: sourceX,
                y1: sourceY,
                x2: targetX,
                y2: targetY,
              }}
            />
          )
        } */}
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke,
            strokeWidth: 2,
            opacity: data._waitingRun ? 0.7 : 1,
          }}
        />
        <EdgeLabelRenderer>
          <div
            className={cn(
              'nopan nodrag hover:scale-125',
              data?._hovering ? 'block' : 'hidden',
              open && '!block',
              data.isInIteration && `z-[${ITERATION_CHILDREN_Z_INDEX}]`,
            )}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            //   opacity: data._waitingRun ? 0.7 : 1,
            }}
          >
            {/* 线中间的加号 */}
            <BlockSelector
              // open={open}
              // onOpenChange={handleOpenChange}
              asChild
              onSelect={handleInsert}
              validBlocksTypes={intersection(availablePrevBlocks, availableNextBlocks)}
              // triggerClassName={() => 'hover:scale-150 transition-all'}
            />
          </div>
        </EdgeLabelRenderer>
      </>
    )
  }

  export default memo(CommonEdge)