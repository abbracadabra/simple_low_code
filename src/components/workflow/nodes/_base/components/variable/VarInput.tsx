// value: val prop: varType， only write， only select

import { VarType } from '@/components/workflow/types'
import { Input, InputNumber, Switch } from 'antd'
import { useMergedState } from 'rc-util';
// import { useMergedState } from 'rc-util';
// import Editor from '../prompt/editor';

type VarInputProps = {
    type: VarType

    // value: string | number | boolean
    value: string
    onChange?: (val: string) => void
}

const VarInput = ({ value:val, onChange, type }: VarInputProps) => {

    const [value, setValue] = useMergedState(val)

    const handleChangeElement = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value; 
        setValue(newValue); 
        onChange?.(newValue); 
      };

    const handleChange = (v: any) => {
        setValue(v)
        onChange?.(v)
    }
    const handleCheck = (v: boolean) => {
        setValue(v ? 'true': 'false')
        onChange?.(v ? 'true': 'false')
    }

    let comp: React.ReactNode
    if (type === VarType.number) {
        comp = <InputNumber value={value} onChange={handleChange} />
    } else if (type === VarType.boolean) {
        comp = <Switch checked={value==='true'} onChange={handleCheck} />
    } else {
        // comp = <Editor
        //     value={val as string}
        //     onChange={handleChange}
        //     varList={nodeVars}
        // />
        comp = <Input value={value} onChange={handleChangeElement}/>
    }

    return <>{comp}</>
}

export default VarInput