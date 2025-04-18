import type { FC } from 'react'
import {
  memo,
} from 'react'
import {
  useReactFlow,
  useViewport,
} from 'reactflow'
import cn from '@/utils/classnames'
import { Tooltip, Divider } from 'antd'
import { ZoomInOutlined, ZoomOutOutlined, BorderOuterOutlined } from '@ant-design/icons'

const ZoomInOut: FC = () => {
  // const { t } = useTranslation()
  const {
    zoomIn, // 放大
    zoomOut, // 缩小
    // zoomTo, // 指定缩放比例
    fitView, // 适应画布
  } = useReactFlow()
  const { zoom } = useViewport() // 缩放比例
  return (
    <div className={`
          p-0.5 h-9 cursor-pointer text-[13px] backdrop-blur-[5px] rounded-lg
          bg-components-actionbar-bg shadow-lg border-[0.5px] border-components-actionbar-border 
          hover:bg-state-base-hover flex items-center justify-between w-[98px] h-8 rounded-lg
        `}>
      <Tooltip
        title='缩小'
      >
        <ZoomOutOutlined style={{ fontSize: '12px' }} onClick={(e) => {
          e.stopPropagation()
          zoomOut()
        }} />
      </Tooltip>
      <div className={cn('w-[34px] system-sm-medium text-text-tertiary hover:text-text-secondary')}>{parseFloat(`${zoom * 100}`).toFixed(0)}%</div>
      <Tooltip
        title={'放大'}
      >
        <ZoomInOutlined style={{ fontSize: '12px' }} onClick={(e) => {
          e.stopPropagation()
          zoomIn()
        }} />
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip
        title={'放大'}
      >
        <BorderOuterOutlined style={{ fontSize: '12px' }} onClick={(e) => {
          e.stopPropagation()
          fitView()
        }} />
      </Tooltip>
    </div>
  )
}

export default memo(ZoomInOut)
