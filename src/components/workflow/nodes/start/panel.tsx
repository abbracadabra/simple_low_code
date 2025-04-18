import type { FC } from 'react'
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import RemoveEffectVarConfirm from '../_base/components/remove-effect-var-confirm'
// import VarList from './components/var-list'
// import VarItem from './components/var-item'
// import useConfig from './use-config'
import type { StartNodeType } from './types'
// import Split from '@/components/workflow/nodes/_base/components/split'
// import Field from '@/components/workflow/nodes/_base/components/field'
// import AddButton from '@/components/base/button/add-button'
// import ConfigVarModal from '@/components/app/configuration/config-var/config-modal'
import { SimpleVarSchema, VarType, type NodeProps } from '@/components/workflow/types'
import { Button, Divider, Form, Input, Modal, Select, Space, Table } from 'antd'
import cn from '@/utils/classnames'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIsChatMode, useNodeDataUpdate, useWorkflowHistoryStore, WorkflowHistoryEvent } from '../../hooks'
import { ChatSysVars, SysVars } from '../../constants'
import VarTypeSelect from '../_base/components/variable/VarTypeSelect'

// const i18nPrefix = 'workflow.nodes.start'
// 展示系统变量+输入变量
const Panel: FC<NodeProps<StartNodeType>> = ({
  id,
  data,
}) => {
  const isChatMode = useIsChatMode()

  const modalRef = useRef<any>()

  const { updateLocalHistory } = useWorkflowHistoryStore()
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()

  const onDelete = (name: string) => {
    const newVars = data.variables.filter(item => item.name !== name)
    handleNodeDataUpdateWithSyncDraft({ id, data: { variables: newVars } }) // 更新store+存db
    updateLocalHistory(WorkflowHistoryEvent.NodeChange) // add本地历史
  }

  const columns = [
    {
      title: '变量',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      render: (value: string) => {
        return <span>{value}</span>
      },
    },
    {
      title: '',
      key: 'action',
      render: (_: any, record: SimpleVarSchema) => (
        <a onClick={() => { onDelete(record.name) }}><DeleteOutlined /></a>
      )
    }
  ]

  const sysCol = [
    {
      title: '变量',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
  ]

  const sysDatasource = useMemo(() => {
    const res: SimpleVarSchema[] = []
    if (isChatMode) {
      res.push(...ChatSysVars)
    } else {
      res.push(...SysVars)
    }
    return res
  }, [isChatMode])

  const handleClickAdd = (value: SimpleVarSchema) => {
    const newVars = [...data.variables, value]
    handleNodeDataUpdateWithSyncDraft({ id, data: { variables: newVars } }) // 更新store+存db
    updateLocalHistory(WorkflowHistoryEvent.NodeChange) // add本地历史
  }

  // 自定义变量 + 系统变量
  return <>
    {!isChatMode && <><Space>
      <div
        className={cn('flex justify-between items-center  w-full')}>
        <div className={cn('system-sm-semibold-uppercase text-text-secondary')}>输入字段</div>
        <PlusOutlined onClick={() => { modalRef.current.show() }} />
      </div>
      <Table columns={columns} dataSource={data.variables} />
    </Space>
      <AddVarModal ref={modalRef} onAdd={handleClickAdd} />
      <Divider />
    </>
    }
    <Table columns={sysCol} dataSource={sysDatasource} />
  </>
}

export default React.memo(Panel)


const AddVarModal = React.forwardRef((props: {
  onAdd: (data: SimpleVarSchema) => void
}, ref) => {

  const [form] = Form.useForm()
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true)
    },
  }));

  // const opts = Object.values(VarType).map(item => {
  //   return {
  //     label: item,
  //     value: item
  //   }
  // })

  const handleClick = async () => {
    let record
    try {
      record = await form.validateFields()
    } catch (errorInfo) {
      return
    }
    props.onAdd(record)
  }

  return <>{show && <Modal open={true} onCancel={() => setShow(false)} footer={<Button onClick={handleClick}></Button>}>
    <Form form={form}>
      <Form.Item label="变量名" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="类型" name="type" rules={[{ required: true }]}>
        <VarTypeSelect />
      </Form.Item>
      <Form.Item label="描述" name="desc">
        <Input />
      </Form.Item>
    </Form>
  </Modal>}</>
})