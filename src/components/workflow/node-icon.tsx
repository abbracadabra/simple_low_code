import type { FC } from 'react'
import { useContext, memo } from 'react'
import { BlockEnum, CommonNodeData } from './types'
import { WorkflowDraftStoreContext } from './context'
import {HomeOutlined,RobotOutlined,CodeOutlined,HomeFilled,RetweetOutlined,CompressOutlined,StopOutlined,ToolOutlined,CalculatorOutlined,ForkOutlined,MessageOutlined} from '@ant-design/icons'
import {
    useStore as useZustandStore,
} from 'zustand'
import constStore from '@/components/base/system-config-store'
import { ToolNodeType } from './nodes/tool/types'
// import {
//     useStore,
//   } from '@/components/workflow/store'

const getIcon = (type: BlockEnum, styles: Record<string, any>) => {
    return {
        [BlockEnum.Start]: <HomeOutlined style={styles} />,
        [BlockEnum.LLM]: <RobotOutlined style={styles} />,
        [BlockEnum.Code]: <CodeOutlined style={styles} />,
        [BlockEnum.End]: <StopOutlined style={styles} />,
        [BlockEnum.IfElse]: <ForkOutlined style={styles} />,
        [BlockEnum.Answer]: <MessageOutlined style={styles} />,
        [BlockEnum.VariableAggregator]: <CompressOutlined style={styles} />,
        [BlockEnum.Assigner]: <CalculatorOutlined style={styles} />,
        [BlockEnum.Tool]: <ToolOutlined style={styles} />,
        [BlockEnum.Iteration]: <RetweetOutlined style={styles} />,
        [BlockEnum.IterationStart]: <HomeFilled style={styles} />,
    }[type]
}

type BlockIconProps = {
    // type: BlockEnum
    // toolName?: string,
    size?: string
    className?: string,
    data: CommonNodeData
    // toolIcon?: string | { content: string; background: string }
}

/**
 * 节点icon
 * 原block-icon.tsx
 */
const NodeIcon: FC<BlockIconProps> = ({
    // type,
    size = 'sm',
    className,
    data
}) => {
    const type = data.type
    
    const tools = constStore(s => s.allTools)
    // const tools = useZustandStore(useContext(WorkflowDraftStoreContext)!, s => s.allTools)
    let toolIcon
    if (type === BlockEnum.Tool) {
        toolIcon = tools.find(t => t.name === (data as ToolNodeType).tool_name)?.icon
    }
    return <div className={`${className}`}>
        {
            type !== BlockEnum.Tool && (
                getIcon(type, { 'fontSize':'16px'})
            )
        }
        {
            type === BlockEnum.Tool && (
                <div
                    className='shrink-0 w-full h-full bg-cover bg-center rounded-md'
                    style={{
                        backgroundImage: `url(${toolIcon})`,
                    }}
                ></div>
            )
        }
    </div>
}

export default memo(NodeIcon)