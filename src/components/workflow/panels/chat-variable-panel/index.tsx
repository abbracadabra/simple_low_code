import React, {
  memo,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import cn from '@/utils/classnames'
import { useWorkflowDraftStore, WorkflowDraftStoreContext } from '../../context'
import { VarType, VarWithConstVal } from '../../types'
import { Button, Form, Input, InputNumber, Modal, Select, Switch, Table } from 'antd'
const { TextArea } = Input;


/**
 * chat var的值是初始值可以不填
 */
const ChatVariablePanel = () => {
  const workflowStore = useContext(WorkflowDraftStoreContext)
  const varList = useWorkflowDraftStore(s => s.conversationVariables) as VarWithConstVal[]
  const newRef = useRef<any>();
  const handleClickAdd = (added: VarWithConstVal) => {
    // todo save
  }
  const handleDel = (name: string) => {
    const newVars = varList.filter(e => e.name !== name)
    // todo save newVars
    workflowStore.getState().setEnvironmentVariables(newVars)
  }

  const col = [
    {
      title: '变量',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'value_type',
      key: 'value_type',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '',
      key: 'op',
      render: (_: any, record: VarWithConstVal) => {
        return <a onClick={() => { handleDel(record.name) }}>删除</a>
      }
      ,
    },
  ];

  return (
    <>
      <div
        className={cn(
          'relative flex flex-col w-[420px] bg-components-panel-bg-alt rounded-l-2xl h-full border border-components-panel-border',
        )}
      >
        <div className='shrink-0 px-4 pt-2 pb-3'>
          <Button type="primary" onClick={() => newRef.current?.show()}>添加</Button>
        </div>
        <div className='grow px-4 rounded-b-2xl overflow-y-auto'>
          <Table columns={col} dataSource={varList || []} />
        </div>
      </div>
      <ChatVarModal ref={newRef} onAdd={handleClickAdd} />
    </>
  )
}

export default memo(ChatVariablePanel)


const validateJsonString = (_: any, value: string) => {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) {
      return Promise.reject(new Error("Value must be a JSON object"));
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(new Error("Invalid JSON format"));
  }
};

const validateJsonArray = (_: any, value: string) => {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Value must be a JSON array"));
  } catch (e) {
    return Promise.reject(new Error("Invalid JSON format"));
  }
};

type ModalProps = {
  onAdd: (added: VarWithConstVal) => void
}
const ChatVarModal = React.forwardRef<any, ModalProps>(({ onAdd }, ref) => {
  const [form] = Form.useForm()
  const value_type = Form.useWatch('value_type', form) || VarType.string
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true)
      form.resetFields();
    },
  }));

  const handleConfirm = async () => {
    let values: any
    try {
      values = await form.validateFields();
    } catch (errorInfo) {
      return
    }
    onAdd({
      name: values.name,
      value: values.value,
      value_type: values.value_type,
      desc: values.desc
    })
    setShow(false)
  }
  const typeOptions = Object.values(VarType).map(t => ({ label: t, value: t }))

  const valueField = {
    [VarType.string]: {
      content: <Input />
    },
    [VarType.number]: {
      content: <InputNumber />
    },
    [VarType.boolean]: {
      content: <Switch />
    },
    [VarType.object]: {
      content: <TextArea placeholder='{"key1": "value1", "key2": "value2"}' rows={3} />,
      rules: [{ validator: validateJsonString }]
    },
    [VarType.arrayString]: {
      content: <Input placeholder='["value1", "value2"]' />,
      rules: [{ validator: validateJsonArray }]
    },
    [VarType.arrayNumber]: {
      content: <Input placeholder='[1,2,3]' />,
      rules: [{ validator: validateJsonArray }]
    },
    [VarType.arrayBoolean]: {
      content: <Input placeholder='[true, false]' />,
      rules: [{ validator: validateJsonArray }]
    },
    [VarType.arrayObject]: {
      content: <Input placeholder='[{"key1": "value1"}, {"key2": "value2"}]' />,
      rules: [{ validator: validateJsonArray }]
    },
}
const { input, ...itemProps } = valueField[value_type]
  return <>{show && <Modal
    title="添加环境变量"
    open={true}
    footer={<Button onClick={handleConfirm}>确认</Button>}
    onCancel={() => setShow(false)}
  >
    <Form form={form} layout="vertical" initialValues={value_type}>
      <Form.Item name='name' label='变量名' rules={[{ required: true }]}><Input /></Form.Item>
      <Form.Item name='value_type' label='类型' rules={[{ required: true }]}><Select options={typeOptions} /></Form.Item>
      {<Form.Item key={value_type} name='value' label='初始值' {...itemProps}>{input}</Form.Item>}
      <Form.Item name='desc' label='描述'><Input /></Form.Item>
    </Form>
  </Modal>}
  </>
})