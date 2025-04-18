// import type { NodeProps } from 'reactflow'
import type { NodeProps } from '../../types'
import type { ComponentType } from 'react'
// import BaseNode from './_base/node'
import { BlockEnum, SimpleVarSchema } from '../../types'
import StartNode from '../start/node'
import EndNode from '../end/node'
import IterationNode from '../iteration/node'
import AssignerNode from '../assigner/node'
import AnswerNode from '../answer/node'
import CodeNode from '../code/node'
import IfElseNode from '../if-else/node'
import LLMNode from '../llm/node'
import ToolNode from '../tool/node'
import VariableAssignerNode from '../variable-aggregator/node'


import type {
    FC,
    ReactElement,
  } from 'react'
  import {
    cloneElement,
    memo,
    useEffect,
    useMemo,
    useRef,
  } from 'react'
  import {
    NodeRunningStatus,
  } from '@/components/workflow/types'
//   import type { NodeProps } from '../../types'
  import NodeIcon from '@/components/workflow/node-icon'
  import cn from 'classnames'
  import {
    NodeSourceHandle,
    NodeTargetHandle,
  } from './components/node-handle'
import { IterationNodeType } from '../iteration/types'

// reactflow 'custom' node type, sub component by data.type
// type=custom节点的渲染，iter-start不在这里它是其他type
const NodeComponentMap: Record<string, ComponentType<any>> = {
    [BlockEnum.Start]: StartNode,
    [BlockEnum.End]: EndNode,
    [BlockEnum.Answer]: AnswerNode,
    [BlockEnum.LLM]: LLMNode,
    // [BlockEnum.KnowledgeRetrieval]: KnowledgeRetrievalNode,
    // [BlockEnum.QuestionClassifier]: QuestionClassifierNode,
    [BlockEnum.IfElse]: IfElseNode,
    [BlockEnum.Code]: CodeNode,
    // [BlockEnum.TemplateTransform]: TemplateTransformNode,
    // [BlockEnum.HttpRequest]: HttpNode,
    [BlockEnum.Tool]: ToolNode,
    // [BlockEnum.VariableAssigner]: VariableAssignerNode,
    [BlockEnum.Assigner]: AssignerNode,
    [BlockEnum.VariableAggregator]: VariableAssignerNode,
    // [BlockEnum.ParameterExtractor]: ParameterExtractorNode,
    [BlockEnum.Iteration]: IterationNode,
    // [BlockEnum.DocExtractor]: DocExtractorNode,
    // [BlockEnum.ListFilter]: ListFilterNode,
}




// const CommonNode = (props: NodeProps) => {
//     const nodeData = props.data
//     const NodeComponent = NodeComponentMap[nodeData.type]

//     return (
//         <>
//             {/* handle、icon and common */}
//             <BaseNode {...props}>
//                 {/* node specific */}
//                 <NodeComponent />
//             </BaseNode>
//         </>
//     )
// }
// CommonNode.displayName = 'CommonNode'




// type BaseNodeProps = NodeProps
  
  const NodeCommonBase: FC<NodeProps> = ({
    id,
    data,
    // children,
  }) => {
    const nodeData = data
    const SubNodeComponent = NodeComponentMap[nodeData.type]

    // const { t } = useTranslation()
    const nodeRef = useRef<HTMLDivElement>(null)
    // const { nodesReadOnly } = useNodesReadOnly()
    // const { handleNodeIterationChildSizeChange } = useNodeIterationInteractions()
  
    // useEffect(() => {
    //   // 若自己在节点内，监听并处理大小变化
    //   if (nodeRef.current && data.selected && data.isInIteration) {
    //     const resizeObserver = new ResizeObserver(() => {
    //       handleNodeIterationChildSizeChange(id)
    //     })
  
    //     resizeObserver.observe(nodeRef.current)
  
    //     return () => {
    //       resizeObserver.disconnect()
    //     }
    //   }
    // }, [data.isInIteration, data.selected, id, handleNodeIterationChildSizeChange])
  
    // const showSelectedBorder = data.selected || data._isBundled || data._isEntering
    const showSelectedBorder = data.selected || data._isBundled // 选中的节点不变色
    const {
      showRunningBorder,
      showSuccessBorder,
      showFailedBorder,
    } = useMemo(() => {
      return {
        showRunningBorder: data._runningStatus === NodeRunningStatus.Running && !showSelectedBorder,
        showSuccessBorder: data._runningStatus === NodeRunningStatus.Succeeded && !showSelectedBorder,
        showFailedBorder: data._runningStatus === NodeRunningStatus.Failed && !showSelectedBorder,
        showExceptionBorder: data._runningStatus === NodeRunningStatus.Exception && !showSelectedBorder,
      }
    }, [data._runningStatus, showSelectedBorder])
  
    return (
      <div
        className={cn(
          'flex border-[2px] rounded-2xl',
          showSelectedBorder ? 'border-components-option-card-option-selected-border' : 'border-transparent',
          // !showSelectedBorder && data._inParallelHovering && 'border-workflow-block-border-highlight',
        )}
        ref={nodeRef}
        style={{
          width: data.type === BlockEnum.Iteration ? data.width : 'auto',
          height: data.type === BlockEnum.Iteration ? data.height : 'auto',
        }}
      >
        <div
          className={cn(
            'group relative pb-1 shadow-xs',
            'border border-transparent rounded-[15px]',
            data.type !== BlockEnum.Iteration && 'w-[240px] bg-workflow-block-bg',
            data.type === BlockEnum.Iteration && 'flex flex-col w-full h-full bg-[#fcfdff]/80',
            !data._runningStatus && 'hover:shadow-lg',
            showRunningBorder && '!border-primary-500',
            showSuccessBorder && '!border-[#12B76A]',
            showFailedBorder && '!border-[#F04438]',
            data._isBundled && '!shadow-lg',
          )}
        >
          {/* {
            data._inParallelHovering && (
              <div className='absolute left-2 -top-2.5 top system-2xs-medium-uppercase text-text-tertiary z-10'>
                {t('workflow.common.parallelRun')}
              </div>
            )
          } */}
          {/* {
            data._showAddVariablePopup && (
              <AddVariablePopupWithPosition
                nodeId={id}
                nodeData={data}
              />
            )
          } */}
          {/* {
            data.type === BlockEnum.Iteration && (
              <NodeResizer
                nodeId={id}
                nodeData={data}
              />
            )
          } */}
          {/* 入端口 */}
          {
            // !data._isCandidate && (
              <NodeTargetHandle
                id={id}
                data={data}
                handleClassName='!top-4 !-left-[9px] !translate-y-0'
                handleId='target'
              />
            // )
          }
          {/* 出端口 */}
          {
            // data.type !== BlockEnum.IfElse && data.type !== BlockEnum.QuestionClassifier && !data._isCandidate && (
            // if else或其他有特殊handle需求的节点，在node自己的文件夹的node.ts里自己加handle
            data.type !== BlockEnum.IfElse && (
              <NodeSourceHandle
                id={id}
                data={data}
                handleClassName='!top-4 !-right-[9px] !translate-y-0'
                handleId='source'
              />
            )
          }
          {/* {
            !data._runningStatus && !nodesReadOnly && !data._isCandidate && (
              <NodeControl
                id={id}
                data={data}
              />
            )
          } */}
          <div className={cn(
            'flex items-center px-3 pt-3 pb-2 rounded-t-2xl',
            data.type === BlockEnum.Iteration && 'bg-[rgba(250,252,255,0.9)]',
          )}>
            {/* 左上角icon */}
            <NodeIcon
              className='shrink-0 mr-2'
              data={data}
              // type={data.type}
              // toolName={data.toolName}
            />
            <div
              title={data.title}
              className='grow mr-1 system-sm-semibold-uppercase text-text-primary truncate flex items-center'
            >
              <div>
                {/* 节点左上的title */}
                {data.title}
              </div>
              {/* 紧跟title后面的一些提示：并行模式（迭代节点时） */}
              {
                data.type === BlockEnum.Iteration && (data as IterationNodeType).is_parallel && (
                  <>&nbsp;&nbsp;<span style={{ color: 'f00' }}>并行模式</span></>
                  // <Tooltip popupContent={
                  //   <div className='w-[180px]'>
                  //     <div className='font-extrabold'>
                  //       {t('workflow.nodes.iteration.parallelModeEnableTitle')}
                  //     </div>
                  //     {t('workflow.nodes.iteration.parallelModeEnableDesc')}
                  //   </div>}
                  // >
                  //   <div className='flex justify-center items-center px-[5px] py-[3px] ml-1 border-[1px] border-text-warning rounded-[5px] text-text-warning system-2xs-medium-uppercase '>
                  //     {t('workflow.nodes.iteration.parallelModeUpper')}
                  //   </div>
                  // </Tooltip>
                )
              }
            </div>
            {/* {
              data._iterationLength && data._iterationIndex && data._runningStatus === NodeRunningStatus.Running && (
                <div className='mr-1.5 text-xs font-medium text-primary-600'>
                  {data._iterationIndex > data._iterationLength ? data._iterationLength : data._iterationIndex}/{data._iterationLength}
                </div>
              )
            }
            {
              (data._runningStatus === NodeRunningStatus.Running || data._singleRunningStatus === NodeRunningStatus.Running) && (
                <RiLoader2Line className='w-3.5 h-3.5 text-primary-600 animate-spin' />
              )
            }
            {
              data._runningStatus === NodeRunningStatus.Succeeded && (
                <RiCheckboxCircleLine className='w-3.5 h-3.5 text-[#12B76A]' />
              )
            }
            {
              data._runningStatus === NodeRunningStatus.Failed && (
                <RiErrorWarningLine className='w-3.5 h-3.5 text-[#F04438]' />
              )
            } */}
          </div>
          {/* 组件节点 */}
          {
            data.type !== BlockEnum.Iteration && (
                <SubNodeComponent id={id}  data={data} />
            //   cloneElement(children, { id, data })
            )
          }
          {/* {
            data.type === BlockEnum.Iteration && (
              <div className='grow pl-1 pr-1 pb-1'>
                {cloneElement(children, { id, data })}
              </div>
            )
          } */}
          {/* 下方的描述 */}
          {
            data.desc && data.type !== BlockEnum.Iteration && (
              <div className='px-3 pt-1 pb-2 system-xs-regular text-text-tertiary whitespace-pre-line break-words'>
                {data.desc}
              </div>
            )
          }
        </div>
      </div>
    )
  }
  NodeCommonBase.displayName = 'NodeCommonBase'

  export default memo(NodeCommonBase)
