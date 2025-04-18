import { VarType } from "@/components/workflow/types"
import { Select } from "antd"

type VarTypeSelectProp = {
    onChange?: (v: VarType) => void
    value?: VarType
    [key: string]: any
}

const VarTypeSelect = ({ onChange, value, ...props }: VarTypeSelectProp) => {
    const opts = Object.values(VarType).map(item => {
        return {
            label: item,
            value: item
        }
    })
    return <Select value={value} onChange={onChange} options={opts} {...props} />
}

export default VarTypeSelect