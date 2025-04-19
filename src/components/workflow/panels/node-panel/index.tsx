import { ComponentType, FC, memo, ReactElement, useCallback } from "react"
import { BlockEnum, CommonNodeData, Node } from "../../types"
import { COMMON_NODE } from "../../constants"
import { useNodes } from "reactflow"
import { useNodeDataUpdate, useNodesInteractions, useNodesReadOnly, useWorkflowHistoryStore, WorkflowHistoryEvent } from "../../hooks"
import NodeIcon from "../../node-icon"
import { Drawer, Input } from "antd"
import StartPanel from '@/components/workflow/nodes/start/panel'
import EndPanel from '@/components/workflow/nodes/end/panel'
import AnswerPanel from '@/components/workflow/nodes/answer/panel'
import IfElsePanel from '@/components/workflow/nodes/if-else/panel'
import CodePanel from '@/components/workflow/nodes/code/panel'
import ToolPanel from '@/components/workflow/nodes/tool/panel'
import VariableAggregatorPanel from '@/components/workflow/nodes/variable-aggregator/panel'
import AssignerPanel from '@/components/workflow/nodes/assigner/panel'
import IterationPanel from '@/components/workflow/nodes/iteration/panel'

export const PanelComponentMap: Record<string, ComponentType<any>> = {
    [BlockEnum.Start]: StartPanel,
    [BlockEnum.End]: EndPanel,
    [BlockEnum.Answer]: AnswerPanel,
    // [BlockEnum.LLM]: LLMPanel,
    [BlockEnum.IfElse]: IfElsePanel,
    [BlockEnum.Code]: CodePanel,
    [BlockEnum.Tool]: ToolPanel,
    [BlockEnum.VariableAggregator]: VariableAggregatorPanel,
    [BlockEnum.Assigner]: AssignerPanel,
    [BlockEnum.Iteration]: IterationPanel,
}


export const Panel = memo(() => {

    const nodes = useNodes<CommonNodeData>() // nodes数组变了就会更新
    const selectedNode = nodes.find(node => node.data.selected)
    if (!selectedNode) {
        return null
    }
    const { id, type, data } = selectedNode
    if (type !== COMMON_NODE) {
        return null
    }
    const PanelComponent = PanelComponentMap[data.type]
    return (
        <BasePanel {...selectedNode}>
            <PanelComponent key={id} id={id} data={data} />
        </BasePanel>
    )
})

Panel.displayName = 'Panel'




type BasePanelProps = {
    children: ReactElement
} & Node

const BasePanel: FC<BasePanelProps> = memo(({
    id,
    data,
    children,
}) => {
    const { handleNodeSelect } = useNodesInteractions()
    const { nodesReadOnly } = useNodesReadOnly()

    const { updateLocalHistory } = useWorkflowHistoryStore()

    const {
        handleNodeDataUpdateWithSyncDraft,
    } = useNodeDataUpdate()

    const handleDataEdit = useCallback((data: Partial<CommonNodeData<any>>) => {
        handleNodeDataUpdateWithSyncDraft({ id, data }) // 修改nodes+存db
        updateLocalHistory(WorkflowHistoryEvent.NodeTitleChange) // add本地历史
    }, [handleNodeDataUpdateWithSyncDraft, updateLocalHistory])

    const handleBlurTitle = (title: string) => {
        if (!title?.length) {
            return
        }
        handleDataEdit({ title })
    }

    const title = <> <NodeIcon
        className='shrink-0 mr-1'
        data={data}
    /> <Input disabled={nodesReadOnly} value={data.title || ''} onBlur={(e) => { handleBlurTitle(e.target.value) }} />  </>

    return <Drawer title={title} onClose={() => { () => { handleNodeSelect(id, false) } }} open={true}>
        <Input disabled={nodesReadOnly} placeholder="添加描述..." value={data.desc || ''} onBlur={(e) => { handleDataEdit({ desc: e.target.value }) }} />
        {children}
    </Drawer>
})