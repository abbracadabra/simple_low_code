import { useEffect, type FC } from 'react'
import React from 'react'
import type { EndNodeType } from './types'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, Input, Table } from 'antd'
import { NodeProps } from '../../types'
import { useNodeDataUpdate } from '../../hooks'
import VarSelect from '../_base/components/variable/VarSelect'

// 外面还有层base panel，data变了会刷新
const Panel: FC<NodeProps<EndNodeType>> = ({
    id,
    data,
}) => {

    const [form] = Form.useForm()

    const {
        handleNodeDataUpdateWithSyncDraft,
    } = useNodeDataUpdate()

    const handleFormChange = (changedValues: any, allValues: any) => {
        const outputs = allValues.outputs
        handleNodeDataUpdateWithSyncDraft({ id, data: { outputs } as EndNodeType })
    }

    useEffect(() => {
        form.setFieldsValue({ outputs: JSON.parse(JSON.stringify(data.outputs)) })
    }, [data])

    // 这里用form， value=, onChange={},add,delete 这些代码少了点点
    return (
        <Form form={form} onValuesChange={handleFormChange}>
            {/* <Form.List name='outputs' initialValue={data.outputs}> */}
            <Form.List name='outputs'>
                {(fields, { add, remove }) => {

                    const handleClickAdd = () => {
                        add({})
                    }

                    const columns = [
                        {
                            title: '变量',
                            render: (_: any, field: any) => (
                                <Form.Item
                                    name={[field.name, 'name']}
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            ),
                        },
                        {
                            title: '值',
                            render: (_: any, field: any) => (
                                <Form.Item
                                    name={[field.name, 'value_selector']}
                                    rules={[{ required: true }]}
                                >
                                    <VarSelect nodeId={id} />
                                </Form.Item>
                            ),
                        },
                        {
                            title: '描述',
                            render: (_: any, field: any) => (
                                <Form.Item
                                    name={[field.name, 'desc']}
                                >
                                    <Input />
                                </Form.Item>
                            ),
                        },
                        {
                            title: '',
                            render: (_: any, field: any) => (
                                <MinusCircleOutlined
                                    onClick={() => remove(field.name)}
                                />
                            ),
                        },
                    ]
                    return <>
                        <div className='mt-2'>
                            <div className='px-4 pb-4 space-y-4'>
                                <div className='flex justify-between items-center w-full'>
                                    <div className='system-sm-semibold-uppercase text-text-secondary'>输出字段</div>
                                    <PlusOutlined onClick={handleClickAdd} />
                                </div>
                                <Table dataSource={fields} columns={columns} />
                            </div>
                        </div>
                    </>
                }}
            </Form.List>
        </Form>
    )
}

export default React.memo(Panel)
