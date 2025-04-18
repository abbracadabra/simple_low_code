import type { FC } from 'react'
import {
  memo,
  // useEffect,
} from 'react'
// import {
//   Background,
//   useNodesInitialized,
//   useViewport,
// } from 'reactflow'
// import { useTranslation } from 'react-i18next'
// import { IterationStartNodeDumb } from '../iteration-start'
// import { useNodeIterationInteractions } from './use-interactions'
import type { IterationNodeType } from './types'
// import AddBlock from './add-block'
import cn from '@/utils/classnames'
import type { NodeProps } from '@/components/workflow/types'
// import Toast from '@/components/base/toast'

// const i18nPrefix = 'workflow.nodes.iteration'

/**
 * iter内的节点的展示是reactflow自己实现的
 * 子节点dom不在本node渲染的dom树内，而是子节点dom展示叠在本node dom之上
 * child.position.x、child.position.y > ITERATION_PADDING，使得不与iter左上角内容overlap
 * iter根据child调节width、height，child node add时计算所有child的x,y的min和max得到width,height
 */
const Node: FC<NodeProps<IterationNodeType>> = ({
  // id,
  // data,
}) => {
  // const { zoom } = useViewport()
  // const nodesInitialized = useNodesInitialized()
  // const { handleNodeIterationRerender } = useNodeIterationInteractions()
  // const { t } = useTranslation()

  // useEffect(() => {
  //   if (nodesInitialized)
  //     handleNodeIterationRerender(id)
  //   if (data.is_parallel && data._isShowTips) {
  //     Toast.notify({
  //       type: 'warning',
  //       message: t(`${i18nPrefix}.answerNodeWarningDesc`),
  //       duration: 5000,
  //     })
  //     data._isShowTips = false
  //   }
  // }, [nodesInitialized, id, handleNodeIterationRerender, data])

  return (
    <div className={cn(
      'relative min-w-[240px] min-h-[90px] w-full h-full rounded-2xl bg-[#F0F2F7]/90',
    )}>
      {/* <Background
        id={`iteration-background-${id}`}
        className='rounded-2xl !z-0'
        gap={[14 / zoom, 14 / zoom]}
        size={2 / zoom}
        color='#E4E5E7'
      />
      {
        data._isCandidate && (
          <IterationStartNodeDumb />
        )
      }
      //迭代里只有开始节点时，会展示'+添加节点'的节点
      {
        data._children!.length === 1 && (
          <AddBlock
            iterationNodeId={id}
            iterationNodeData={data}
          />
        )
      } */}
    </div>
  )
}

export default memo(Node)
