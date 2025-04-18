import type {
  FC,
} from 'react'
import {
  memo,
  useCallback,
  useState,
} from 'react'
import { Tabs as AntTabs } from 'antd'
import type { TabsProps as AntTabProps } from 'antd'
import NodeSelectList from './node-select-list'
import ToolSelectList from './tool-select-list'
import type { BlockEnum, OnSelectBlock } from '../types'
import type {
  // OffsetOptions,
  Placement,
} from '@floating-ui/react'
import classNames from '@/utils/classnames'
import { Input, Popover } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

type NodeSelectorProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect: OnSelectBlock
  trigger?: React.ReactNode
  placement?: Placement //应该是点击连接点出现的浮框
  // offset?: OffsetOptions
  // triggerStyle?: React.CSSProperties
  // triggerClassName?: (open: boolean) => string
  // triggerInnerClassName?: string
  popupClassName?: string
  asChild?: boolean
  validBlocksTypes?: BlockEnum[]
  disabled?: boolean
  noBlocks?: boolean // tab只展示tool tab
}

const NodeSelector: FC<NodeSelectorProps> = ({
  onSelect,
  trigger, // 自定义渲染加号
  // placement = 'right',
  // offset = 6,
  // triggerClassName,
  // triggerInnerClassName,
  // triggerStyle,
  popupClassName,
  // asChild,
  validBlocksTypes,
  // disabled,
  noBlocks = false, // tab只展示tool tab
}) => {
  const [searchText, setSearchText] = useState('')
  const handleSelect = useCallback<OnSelectBlock>((type, dataExtra) => {
    onSelect(type, dataExtra)
  }, [onSelect])


  const popup = <div className={
    classNames(`rounded-lg border-[0.5px] backdrop-blur-[5px]
      border-components-panel-border bg-components-panel-bg-blur shadow-lg`, popupClassName)}>
    {/* 搜索输入框 */}
    <div className='p-2 pb-1' onClick={e => e.stopPropagation()}>
      <Input
        value={searchText}
        addonBefore={<SearchOutlined />}
        placeholder="查找"
        onChange={e => setSearchText(e.target.value)}
        onClear={() => setSearchText('')}
      />
    </div>
    {/* tab */}
    <NodeTabs
      onSelect={handleSelect}
      searchText={searchText}
      validBlocksTypes={validBlocksTypes}
      noBlocks={noBlocks}
    />
  </div>

  return <>
    <Popover content={popup} trigger="click">
      {trigger ? trigger: <PlusOutlined style={{ fontSize: '12px' }}/>}
    </Popover>
  </>
}

// 线左边右边中间的加号
export default memo(NodeSelector)




export type TabsProps = {
  searchText: string
  onSelect: OnSelectBlock // type:节点类型，选工具时，type=tool
  validBlocksTypes?: BlockEnum[]
  noBlocks?: boolean
}

const NodeTabs = memo(({
  searchText,
  onSelect,
  validBlocksTypes,
  noBlocks,
}: TabsProps) => {
  const items: AntTabProps['items'] = []
  if (!noBlocks) {
    items.push({
      key: '1',
      label: '节点',
      children: <NodeSelectList
        searchText={searchText}
        onSelect={onSelect}
        validBlocksTypes={validBlocksTypes} // 允许选的节点
      />,
    })
  }
  items.push({
    key: '2',
    label: '工具',
    children: <ToolSelectList
      searchText={searchText}
      onSelect={onSelect}
    />,
  })
  return <AntTabs items={items} />
})
