import { useMemo } from "react"
import { useWorkflowVariables } from "../../hooks"
import { Select, Tag } from "antd"
import { ValueSelector } from "../../types"

// select的选择返回是否可返回selector以及type
export type ChildVarSelectProps = {
    nodeId: string
    value: ValueSelector
    onChange?: (value: ValueSelector) => void

    [key: string]: any
}
const ChildVarSelect = ({ nodeId, value, onChange, ...props }: ChildVarSelectProps) => {
    const { getChildNodeVars } = useWorkflowVariables()
    const childVars = useMemo(() => getChildNodeVars(nodeId), [getChildNodeVars, nodeId])
    const opts = useMemo(() => {
        return childVars.map(item => {
            return {
                label: <span>{item.title}</span>,
                title: item.title,
                options: item.vars.map(v => ({
                    label: <><Tag>{item.title + '/' + v.name}</Tag><Tag>{v.type}</Tag></>,
                    value: item.nodeId + '.' + v.name
                }))
            }
        })
    }, [childVars])
    return <Select options={opts} value={value?.length ? value.join(".") : undefined} onChange={(v) => { onChange?.(v?.split(".")) }} {...props} />
}

export default ChildVarSelect


