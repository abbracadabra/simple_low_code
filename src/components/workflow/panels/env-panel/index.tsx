import React, {
    memo,
    useContext,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import {
    VarType,
    type VarWithConstVal,
} from '@/components/workflow/types'
import cn from '@/utils/classnames'
const { TextArea } = Input;
import { useWorkflowDraftStore, WorkflowDraftStoreContext } from '../../context'
import { Button, Form, Input, InputNumber, Modal, Select, Switch, Table } from 'antd'

const EnvPanel = () => {
    const workflowStore = useContext(WorkflowDraftStoreContext)
    const envList = useWorkflowDraftStore(s => s.environmentVariables) as VarWithConstVal[]
    const newRef = useRef<any>();

    const handleClickAdd = (added: VarWithConstVal) => {
        // todo
    }
    const handleDel = (name: string) => {
        const newEnvs = envList.filter(e => e.name !== name)
        // save newEnvs todo
        workflowStore.getState().setEnvironmentVariables(newEnvs)
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
                {/* <div className='shrink-0 flex items-center justify-between p-4 pb-0 text-text-primary system-xl-semibold'>
                    环境变量
                </div> */}
                <div className='shrink-0 px-4 pt-2 pb-3'>
                    <Button type="primary" onClick={() => newRef.current?.show()}>添加</Button>
                </div>
                <div className='grow px-4 rounded-b-2xl overflow-y-auto'>
                    <Table columns={col} dataSource={envList || []} />
                </div>
            </div>
            <AddEnvModal ref={newRef} onAdd={handleClickAdd} />
        </>
    )
}

export default memo(EnvPanel)

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
const AddEnvModal = React.forwardRef<any, ModalProps>(({ onAdd }, ref) => {
    const [form] = Form.useForm()
    const value_type:string = Form.useWatch('value_type', form) || VarType.string
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
            content: <Input />,
            rules: [{ required: true }]
        },
        [VarType.number]: {
            content: <InputNumber />,
            rules: [{ required: true }]
        },
        [VarType.boolean]: {
            content: <Switch />,
            rules: [{ required: true }]
        },
        [VarType.object]: {
            content: <TextArea placeholder='{"key1": "value1", "key2": "value2"}' rows={3} />,
            rules: [{ required: true },{ validator: validateJsonString }]
        },
        [VarType.arrayString]: {
            content: <Input placeholder='["value1", "value2"]' />,
            rules: [{ required: true },{ validator: validateJsonArray }]
        },
        [VarType.arrayNumber]: {
            content: <Input placeholder='[1,2,3]' />,
            rules: [{ required: true },{ validator: validateJsonArray }]
        },
        [VarType.arrayBoolean]: {
            content: <Input placeholder='[true, false]' />,
            rules: [{ required: true },{ validator: validateJsonArray }]
        },
        [VarType.arrayObject]: {
            content: <Input placeholder='[{"key1": "value1"}, {"key2": "value2"}]' />,
            rules: [{ required: true },{ validator: validateJsonArray }]
        },
    }
    const { input, ...itemProps } = valueField[value_type]
    return <>{show && <Modal
        title="添加环境变量"
        open={true}
        footer={<Button onClick={handleConfirm}>确认</Button>}
        onCancel={() => setShow(false)}
    >
        <Form form={form} initialValues={{value_type}} layout="vertical">
            <Form.Item name='name' label='变量名' rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name='value_type' label='类型' rules={[{ required: true }]}><Select options={typeOptions}></Select></Form.Item>
            {<Form.Item key={value_type} name='value' label='值' {...itemProps}>{input}</Form.Item>}
            <Form.Item name='desc' label='描述'><Input /></Form.Item>
        </Form>
    </Modal>}
    </>
})