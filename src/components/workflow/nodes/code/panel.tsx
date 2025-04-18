import type { FC } from 'react'
import React, { useCallback, useRef } from 'react'
import type { CodeNodeType } from './types'
import { CodeLanguage } from './types'
import { NodeProps, SimpleVarSchema, VarType, VarWithSelector } from '../../types'
import { Col, Divider, Input, Row, Select } from 'antd'
import VarSelect from '../_base/components/variable/VarSelect'
import produce from 'immer'
import { useNodeDataUpdate, useNodesReadOnly } from '../../hooks'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import Editor, { loader } from '@monaco-editor/react'
import VarTypeSelect from '../_base/components/variable/VarTypeSelect'

const languageOption = [
  {
    label: 'Python3',
    value: CodeLanguage.python3,
  },
  {
    label: 'JavaScript',
    value: CodeLanguage.javascript,
  },
]

// 映射成monaco-editor的language
export const editorLanguageMap = {
  [CodeLanguage.python3]: 'python',
  [CodeLanguage.javascript]: 'javascript',
}

const Panel: FC<NodeProps<CodeNodeType>> = ({
  id,
  data,
}) => {

  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()

  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const editorRef = useRef<any>(null)

  const handleChange = useCallback((item: Partial<VarWithSelector>, i: number) => {
    const newData = produce(data, (draft) => {
      draft.variables[i] = { ...draft.variables[i], ...item }
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])


  const handleChangeOut = useCallback((item: Partial<SimpleVarSchema>, i: number) => {
    const newData = produce(data, (draft) => {
      draft.outputs[i] = { ...draft.outputs[i], ...item }
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleAddOutVar = useCallback(() => {
    const newData = produce(data, (draft) => {
      draft.outputs.push({ name: 'var1', type: VarType.string })
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleAddVar = useCallback(() => {
    const newData = produce(data, (draft) => {
      draft.variables.push({
        name: '',
        value_selector: [],
      })
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleVarRemove = useCallback((index: number) => {
    const newData = produce(data, (draft) => {
      draft.variables.splice(index, 1)
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleLanguageChange = useCallback((lang: CodeLanguage) => {
    const newData = produce(data, (draft) => {
      draft.code_language = lang
      draft.code = ''
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleRemoveOut = useCallback((index: number) => {
    const newData = produce(data, (draft) => {
      draft.outputs.splice(index, 1)
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
  }

  const handleCodeChange = useCallback((code: string) => {
    const newData = produce(data, (draft) => {
      draft.code = code
    })
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newData,
    })
  }, [data, handleNodeDataUpdateWithSyncDraft])

  return (

    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        输入变量 <PlusOutlined onClick={handleAddVar} />
        {data.variables.map((item, i) => {
          return <Row>
            <Col span={4}><Input placeholder='变量名' value={item.name} onChange={(v) => { handleChange({ name: v.target.value }, i) }} /></Col>
            <Col span={6}><Input placeholder='描述' value={item.desc} onChange={(v) => { handleChange({ desc: v.target.value }, i) }} /></Col>
            <Col span={12}><VarSelect nodeId={id} value={item.value_selector} onChange={(v) => { handleChange({ value_selector: v }, i) }} /></Col>
            <Col span={2}><DeleteOutlined onClick={() => handleVarRemove(i)} /></Col>
          </Row>
        })}
        <Divider />

        <Select placeholder='语言' options={languageOption} value={data.code_language} onChange={handleLanguageChange}/>
        {/* https://www.npmjs.com/package/@monaco-editor/react */}
        <Editor
          language={editorLanguageMap[data.code_language] || 'javascript'}
          // theme='default-theme' // sometimes not load the default theme
          value={data.code}
          onChange={handleCodeChange}
          // https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorOptions.html
          options={{
            readOnly,
            domReadOnly: true,
            quickSuggestions: false,
            minimap: { enabled: false },
            lineNumbersMinChars: 1, // would change line num width
            wordWrap: 'on', // auto line wrap
            unicodeHighlight: {
              ambiguousCharacters: false,
            },
          }}
          onMount={handleEditorDidMount}
        />
      </div>
      <Divider />
      输出变量 <PlusOutlined onClick={handleAddOutVar} />
      {data.outputs.map(({ name, type, desc }, i) => {
        return <Row>
          <Col span={6}><Input placeholder='变量名' value={name} onChange={(v) => { handleChangeOut({ name: v.target.value }, i) }} /></Col>
          <Col span={6}><Input placeholder='描述' value={desc} onChange={(v) => { handleChangeOut({ desc: v.target.value }, i) }} /></Col>
          <Col span={10}><VarTypeSelect placeholder='类型' value={type} onChange={(v) => { handleChangeOut({ type: v }, i) }} /> </Col>
          <Col span={2}><DeleteOutlined onClick={() => handleRemoveOut(i)} /></Col>
        </Row>
      })}
    </div >
  )
}

export default React.memo(Panel)
