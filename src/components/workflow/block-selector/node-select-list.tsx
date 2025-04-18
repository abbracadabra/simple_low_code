import {
  memo,
} from 'react'
import { BlockEnum, OnSelectBlock } from '../types'
import { Popover } from 'antd';
import { NODES_EXTRA_INFO } from '../nodes/constants';

type BlocksProps = {
  searchText: string
  onSelect: OnSelectBlock
  validBlocksTypes?: BlockEnum[]
}

// 节点选择tab
const NodeSelectList = ({
  onSelect,
  validBlocksTypes
}: BlocksProps) => {
  return validBlocksTypes.filter(type => type !== BlockEnum.Tool).map(type => {
    return <Popover key={type} placement="right" title={NODES_EXTRA_INFO[type].title} content={NODES_EXTRA_INFO[type].about}>
      <div
        className='flex items-center px-3 w-full h-8 rounded-lg hover:bg-state-base-hover cursor-pointer'
        onClick={() => onSelect(type)}
      >
        <div className='text-sm text-text-secondary'>{NODES_EXTRA_INFO[type].title}</div>
      </div>
    </Popover>
  })
}

export default memo(NodeSelectList)