import { useMemo } from "react"
import { useWorkflowVariables } from "../../hooks"
import { Select } from "antd"

const ChildVarSelect = ({nodeId}:{nodeId: string}) => {
    const {getChildNodeVars} = useWorkflowVariables()

    const childVars = useMemo(()=> getChildNodeVars(nodeId), [getChildNodeVars,nodeId])

    return <Select options={} value={} onChange={}/>
}

export default ChildVarSelect