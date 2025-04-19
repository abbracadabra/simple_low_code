import { useMemo } from "react"
import { useWorkflowVariables } from "../../hooks"
import { Select, Tag } from "antd"
import { ValueSelector, VarType } from "../../types"

// select的选择返回是否可返回selector以及type
export type ChildVarSelectProps = {
    nodeId: string
    value: ValueSelector
    onChange?: (value: ValueSelector, type: VarType) => void

    [key: string]: any
}
const ChildVarSelect = ({ nodeId, value, onChange, ...props }: ChildVarSelectProps) => {
    const { getChildNodeVars } = useWorkflowVariables()
    const childVars = useMemo(() => getChildNodeVars(nodeId), [getChildNodeVars, nodeId])

    const handleChange = (v: string) => {
        const selector = v?.split(".")
        if (!selector || selector.length < 2) {
            return
        }
        const [first,...second] = selector
        const s = childVars.find(item => item.nodeId === first).vars.find(v => v.name === second.join("."))
        onChange?.(v?.split("."), s.type)
    }
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
    return <Select options={opts} value={value?.length ? value.join(".") : undefined} onChange={handleChange} {...props} />
}

export default ChildVarSelect


