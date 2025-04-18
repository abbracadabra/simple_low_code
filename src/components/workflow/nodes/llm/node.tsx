import type { FC } from 'react'
import React from 'react'
import type { LLMNodeType } from './types'
// import {
//   useTextGenerationCurrentProviderAndModelAndModelList,
// } from '@/app/components/header/account-setting/model-provider-page/hooks'
// import ModelSelector from '@/components/header/account-setting/model-provider-page/model-selector'
import type { NodeProps } from '@/components/workflow/types'
import ModelSelector from '@/components/base/model-selector'

const Node: FC<NodeProps<LLMNodeType>> = ({
  data,
}) => {
  const { name: modelName } = data.model || {}
  // const {
  //   textGenerationModelList,
  // } = useTextGenerationCurrentProviderAndModelAndModelList()
  // const hasSetModel = !!modelName

  if (!modelName?.length)
    return null

  return (
    <div className='mb-1 px-3 py-1'>
      {
        <ModelSelector
        value={modelName}
        disabled
          // defaultModel={{ provider, model: modelId }}
          // modelList={textGenerationModelList}
          // readonly
        />
      }
    </div>
  )
}

export default React.memo(Node)
