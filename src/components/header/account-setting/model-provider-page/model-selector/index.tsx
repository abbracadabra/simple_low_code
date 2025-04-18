import { Select } from 'antd';
import type { FC } from 'react'


const AllModels = []

type ModelSelectorProps = {
    value?: string
    // modelList: Model[]
    // triggerClassName?: string
    // popupClassName?: string
    handleChange?: (model: string) => void
    // readonly?: boolean
  }

const ModelSelector: FC<ModelSelectorProps> = ({
    value,
    // modelList,
    // triggerClassName,
    // popupClassName,
    handleChange,
    // readonly,
    ...props
  }) => {

    return  <Select></Select>
  }

  export default ModelSelector