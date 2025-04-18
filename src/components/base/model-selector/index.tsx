import { Select } from 'antd';
import type { FC } from 'react'
import modelStore from '@/components/base/system-config-store'
import { useStore } from 'zustand';

type ModelSelectorProps = {
    // value?: string
    // modelList: Model[]
    // triggerClassName?: string
    // popupClassName?: string
    // handleChange?: (model: string) => void
    // readonly?: boolean
} & Record<string, any>

const ModelSelector: FC<ModelSelectorProps> = (props) => {

    const models = useStore(modelStore, (state) => state.llmModels)
    const options = models.map(model => ({ value: model.name, label: model.name }))
    return  <Select options={options} {...props}></Select>
  }

  export default ModelSelector