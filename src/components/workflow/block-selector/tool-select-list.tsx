import {
  memo,
  useCallback,
  useRef,
} from 'react'
import {
  useMemo,
} from 'react'
import type {
  CommonNodeData,
} from '../types'
// import { useWorkflowDraftStore } from '../context'
import { Tooltip } from 'antd';
import { BlockEnum } from '../types'
import type { Tool } from '@/components/tools/types'
import { ToolNodeType } from '../nodes/tool/types';
import constStore from '@/components/base/system-config-store'

type AllToolsProps = {
  searchText: string
  onSelect: (type: BlockEnum, dataExtra: Partial<CommonNodeData<ToolNodeType>>) => void
}

const ToolSelectList = ({
  searchText,
  onSelect,
}: AllToolsProps) => {

  const allTools = constStore(s => s.allTools)
  // const allTools = useWorkflowDraftStore(s => s.allTools)
  const isMatchingKeywords = (text: string, keywords: string) => {
    return text.toLowerCase().includes(keywords.toLowerCase())
  }

  const matchTools = useMemo(() => {
    return allTools.filter((tool) => {
      return isMatchingKeywords(tool.label, searchText)
    })
  }, [allTools, searchText])

  const renderGroup = useCallback((tool: Tool) => {
    return (
      <Tooltip
        placement="right"
        key={tool.name}
        className='w-[200px]'
        title={(
          <div>
            <div className='mb-1 system-md-medium text-text-primary'>{tool.label}</div>
            <div className='system-xs-regular text-text-tertiary'>{tool.description}</div>
          </div>
        )}
      >
        <div
          className='flex items-center px-3 w-full h-8 rounded-lg hover:bg-state-base-hover cursor-pointer'
          onClick={() => onSelect(BlockEnum.Tool, { tool_name: tool.name, title: tool.label })}
        >
          <div className='text-sm text-text-secondary flex-1 min-w-0 truncate'>{tool.label}</div>
        </div>
      </Tooltip>
    )
  }, [onSelect])

  return (
    <div className='p-1 max-w-[320px] max-h-[464px] overflow-y-auto'>
      {
        !matchTools.length && (
          <div className='flex items-center px-3 h-[22px] text-xs font-medium text-text-tertiary'>未找到工具</div>
        )
      }
      {!!matchTools.length && matchTools.map(renderGroup)}
    </div>
  )
}

export default ToolSelectList