import type { FC } from 'react'
import React, { useCallback } from 'react'
// import { useTranslation } from 'react-i18next'
// import Split from '../_base/components/split'
import type { ToolNodeType } from './types'
// import useConfig from './use-config'
// import InputVarList from './components/input-var-list'
// import Button from '@/components/base/button'
// import Field from '@/components/workflow/nodes/_base/components/field'
// import type { NodePanelProps } from '@/components/workflow/types'
// import Form from '@/components/header/account-setting/model-provider-page/model-modal/Form'
// import ConfigCredential from '@/components/tools/setting/build-in/config-credentials'
// import Loading from '@/components/base/loading'
// import BeforeRunForm from '@/components/workflow/nodes/_base/components/before-run-form'
// import OutputVars, { VarItem } from '@/components/workflow/nodes/_base/components/output-vars'
// import ResultPanel from '@/components/workflow/run/result-panel'
// import { useRetryDetailShowInSingleRun } from '@/components/workflow/nodes/_base/components/retry/hooks'
import { useNodeDataUpdate } from '@/components/workflow/hooks'
import { NodeProps } from 'reactflow'
import constStore from '@/components/base/system-config-store'
import { Col, Divider, Row } from 'antd'
import VarSelectInput from '../_base/components/variable/VarSelectInput'
import { ValueSelector } from '../../types'
import produce from 'immer'

const Panel: FC<NodeProps<ToolNodeType>> = ({
  id,
  data,
}) => {
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()

  const allTools = constStore(s => s.allTools)
  const tool = allTools.find(tool => tool.name === data.tool_name)

  const inputSchema = tool.parameters
  const outSchema = tool.outputVars
  const inputValues = data.tool_parameters

  const handleInputChange = useCallback((name: string, value: string | ValueSelector) => {
    const newData = produce(data, draft => {
      draft.tool_parameters[name] = value
    })
    handleNodeDataUpdateWithSyncDraft({ id, data: newData })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const inputSection = inputSchema?.map(item => {
    return <div>
      <Row><Col span={4}>{item.name}</Col><Col span={4}>{item.type}</Col><Col span={4}>{item.required ? '必填' : ''}</Col></Row>
      <Row><Col span={24}><VarSelectInput nodeId={id} type={item.type} mix={true} value={inputValues?.[item.name]} onChange={(v) => { handleInputChange(item.name, v) }} /></Col></Row>
    </div>
  })

  return (
    <div className='pt-2'>
      <div className='px-4 space-y-4'>
        {inputSchema?.length > 0 &&
          <>
            输入变量
            {inputSection}
            <Divider />
          </>
        }
      </div>
      <div>
        输出变量
        {outSchema.map((item) => {
          return <Row><Col span={4}>{item.name}</Col><Col span={4}>{item.desc}</Col><Col span={4}>{item.type}</Col></Row>
        })}
      </div>
    </div>
  )
}

export default React.memo(Panel)
