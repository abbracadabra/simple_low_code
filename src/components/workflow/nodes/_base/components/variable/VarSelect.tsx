
// value: selector

import { useBeforeNodeVars } from "@/components/workflow/hooks"
import { NodeOutputVar, SimpleVarSchema, ValueSelector, VarType } from "@/components/workflow/types"
import { Select } from "antd"
import { useMemo } from "react"
import { useMergedState } from 'rc-util';

type VarSelectProps = {
    nodeId: string
    type?: VarType

    value?: ValueSelector
    onChange?: (val: ValueSelector) => void

    varFilter?: (v: SimpleVarSchema, o: NodeOutputVar) => boolean

    [key: string]: any
}


const VarSelect = ({ onChange, type, nodeId, value: val, varFilter, ...props }: VarSelectProps) => {

    const [value, setValue] = useMergedState<ValueSelector>(val)

    const handleOnChange = (v: ValueSelector) => {
        setValue(v)
        onChange?.(v)
    }

    const nodeVars = useBeforeNodeVars({ nodeId })
    const opts = useMemo(() => {
        let nvs = nodeVars
        if (type || varFilter) {
            nvs = nvs.map(item=> {
                return {
                    ...item,
                    vars: item.vars.filter(v => type ? v.type === type : true).filter(v => varFilter ? varFilter(v, item) : true)
                }
            }).filter(item => item.vars.length > 0)
        }
        // 转成antd select的选项
        return nvs.map(item => {
            return {
                label: <span>{item.title}</span>,
                title: item.title,
                options: item.vars.map(v => ({
                    label: <span>{item.title + '/' + v.name}</span>,
                    value: item.nodeId + '.' + v.name
                }))
            }
        })
    }, [nodeVars, type])

    return <Select
        options={opts}
        onChange={(v) => { handleOnChange(v?.split(".")) }}
        value={value?.length ? value?.join(".") : undefined}
        {...props} />
}

export default VarSelect


// prop有type，则value是selector，如果有type，则value是selector或input

// prop无type，value是selector




// varselect
// varinput
// varInputSelect



