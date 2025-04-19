// value: val prop: varType， only write， only select

import { ValueSelector, VarType } from '@/components/workflow/types'
import { Switch } from 'antd'
import { useMemo, useState } from 'react';
// import { useMergedState } from 'rc-util';
import VarInput from './VarInput'
import VarSelect from './VarSelect'
import Editor from '../prompt/editor';
import { useMergedState } from 'rc-util';
import { useWorkflowVariables } from '@/components/workflow/hooks';

type VarSelectInputProps = {
    nodeId: string
    type: VarType
    mix?: boolean

    value: string | ValueSelector
    onChange?: (val: string | ValueSelector) => void
}

const VarSelectInput = ({ nodeId, value: val, onChange, type, mix }: VarSelectInputProps) => {

    const [value, setValue] = useMergedState(val)

    const [isManual, setIsManual] = useState(!(value === undefined || value === null || Array.isArray(value))) // switch切换手写/输入  true手输 false引用

    const {getBeforeNodeVars} = useWorkflowVariables()

    const nodeVars = useMemo(()=>{
        return getBeforeNodeVars(nodeId)
    },[getBeforeNodeVars,nodeId])
    // const nodeVars = useBeforeNodeVars({ nodeId })

    const onSwitch = (isManual: boolean) => {
        setIsManual(isManual)
        setValue(undefined)
        onChange?.(undefined)
    }

    // string统一输入+选择混合
    if (type === VarType.string && mix) {
        return <Editor value={value as string} onChange={onChange} varList={nodeVars} />
    }

    let comp: React.ReactNode
    if (isManual) {
        comp = <VarInput type={type} value={value as string} onChange={onChange} />
    } else {
        comp = <VarSelect nodeId={nodeId} type={type} onChange={onChange} value={value as ValueSelector} />
    }

    return <>{comp}<Switch checkedChildren="手输" unCheckedChildren="引用" value={isManual} onChange={onSwitch} /></>
}

export default VarSelectInput