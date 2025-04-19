/* eslint-disable @typescript-eslint/ban-types */
import type { Edge as ReactFlowEdge, Node as ReactFlowNode } from 'reactflow';
// import type { ToolDefaultValue } from '@/components/workflow/block-selector/types'
// import type { ChatVarType } from '@/components/workflow/panel/chat-variable-panel/type'
import { ToolNodeType} from '@/components/workflow/nodes/tool/types'
import type { NodeProps as ReactNodeProps } from 'reactflow'

export enum BlockEnum {
  Start = 'start',
  End = 'end', // gen flow
  Answer = 'answer', // chat flow
  LLM = 'llm',
  // KnowledgeRetrieval = 'knowledge-retrieval', // todo 之后再做
  // QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  // TemplateTransform = 'template-transform',
  // HttpRequest = 'http-request',
  // VariableAssigner = 'variable-assigner',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  // ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration', // 列表map操作，输入可选arr变量，输出array，内部元素可引用额外的item,idx变量
  // DocExtractor = 'document-extractor',
  // ListFilter = 'list-operator',
  IterationStart = 'iteration-start',
  Assigner = 'assigner', // 只在chatflow，会话变量赋值
}

// export enum ControlMode {
//   Pointer = 'pointer',
//   Hand = 'hand',
// }
export enum ControlMode {
  mouse = 'mouse',
  pad = 'pad',
}

export type Branch = {
  id: string // also handle id
  name: string // panel里下一步里分叉展示名字
}

// custom node data type，原CommonNodeType
export type CommonNodeData<T = {}> = {
  type: BlockEnum; // inner type in data of node typed common  
  // _connectedSourceHandleIds?: string[]; // 节点的source handle ids
  // _connectedTargetHandleIds?: string[]; // 节点的target handle ids
  // _targetBranches?: Branch[] // node.data里的通用数据，大致就是存了node的handleids，通用panel的下一步一栏会看_targetBranches
  _isSingleRun?: boolean;
  _runningStatus?: NodeRunningStatus // 运行状态，根据值node的边会变色，_base/node.tsx
  // _singleRunningStatus?: NodeRunningStatus
  // _isCandidate?: boolean; // 是否是伪节点，你在左下角点击加号添加的节点会跟着鼠标走，此时节点不在reactflow中，详见candidate-node.tsx
  _isBundled?: boolean; // 是否圈中
  // _children?: string[]; // 改改代码，把它删掉
  // _isEntering?: boolean;
  _showAddVariablePopup?: boolean;
  _holdAddVariablePopup?: boolean;
  _iterationLength?: number;
  _iterationIndex?: number;
  // _inParallelHovering?: boolean;
  isInIteration?: boolean;
  // iteration_id?: string;
  selected?: boolean;
  title: string; // 输入node名
  desc: string; // 输入node描述
  width?: number;
  height?: number;
  // toolName?: string; // type=tool时有
} & T;
// & Partial<Pick<ToolDefaultValue, 'tool_name'>>


export type CommonEdgeType = {
  _hovering?: boolean; // hover后label展示
  _isBundled?: boolean; // 是否圈中
  // _sourceRunningStatus?: NodeRunningStatus; // 线左边节点的测试运行状态，和颜色有关，可以看到测试运行时执行路径上的节点和线颜色改变。会根据src stat和trg stat渐进着色，看linearGradientId
  // _targetRunningStatus?: NodeRunningStatus; // 线右边节点的测试运行状态，和测试运行时实时执行时颜色有关
  // _waitingRun?: boolean // 流程测试执行时 & 未到达的edge，加点透明
  _run?: boolean // 流程测试执行时 & 已run的edge，颜色改变   todo 把上面三个废弃，留这个
  isInIteration?: boolean;
  // iteration_id?: string;
  sourceType: BlockEnum; // 线的起点的节点类型，此处不是reactflow的组件类型，而是custom_node组件的的二级类型
  targetType: BlockEnum; // 线的终点的节点类型，此处不是reactflow的组件类型，而是custom_node组件的的二级类型
};

export type Node<T = {}> = ReactFlowNode<CommonNodeData<T>>;
export type NodeProps<T = unknown> = Pick<Node<T>, 'id' | 'data'> // reactflow有NodeProps，这里摘出有用到的属性
// export type NodeProps<T = unknown> = { id: string; data: CommonNodeData<T> }
export type Edge = ReactFlowEdge<CommonEdgeType>

export type ValueSelector = string[] // [节点id,变量] 

// 原Variable    VarWithValue
export type VarWithSelector = {
  name: string // 名
  value_selector: ValueSelector // [节点id,变量] 
  desc?: string // label

  // variable_type?: VarKindType
  // value?: string
  // options?: string[]
  // required?: boolean
  // isParagraph?: boolean
}

export type VarWithConstVal = {
  name: string,
  value: any,
  value_type: VarType
  desc: string
}

// export type EnvironmentVariable = {
//   name: string
//   value: any
//   value_type: 'string' | 'number'
//   description: string
// }

// export type ConversationVariable = {
//   name: string
//   value: any
//   // value_type: ChatVarType
//   value_type: VarType
//   description: string
// }

// export enum InputVarType {
//   string = 'string',
//   // select = 'select',
//   number = 'number',
//   // files = 'files',
//   json = 'json', // obj, array
//   // singleFile = 'file',
//   // multiFiles = 'file-list',
// }

// 参数签名,类似工具的ToolInputVarSchema
// export type InputVarSchema = {
//   // type: InputVarType
//   name: string //变量名称
//   type: VarType
//   desc?: string //desc
//   // max_length?: number
//   // default?: string
//   // required?: boolean
//   // hint?: string
//   // options?: string[]
//   // value_selector?: ValueSelector
// }
// } & Partial<UploadFileSetting>

export type ModelConfig = {
  // provider: string
  name: string
  // mode: string // chat模式的模型prompt是多个的
  completion_params: Record<string, any> // 例如temperature: 0.7,
}

export enum PromptRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export type PromptItem = {
  id?: string
  role?: PromptRole
  text: string
  // edition_type?: EditionType
  // jinja2_text?: string
}

export type Memory = {
  // role_prefix?: RolePrefix
  // window: {
    enabled: boolean
    size: number | string | null
  // }
  // query_prompt_template: string // 用户发的问题
}

// 会持久化和反序列化  env、start、chat，所以反序列化时any只会是string，导致any无效
// export enum ConstVarType {
//   string = 'string',
//   number = 'number',
//   boolean = 'boolean',
//   object = 'object',
//   arrayString = 'array[string]',
//   arrayNumber = 'array[number]',
//   arrayBoolean = 'array[boolean]',
//   arrayObject = 'array[object]',
// }

export enum VarType {
  string = 'string',
  number = 'number', // double
  boolean = 'boolean',
  object = 'object',
  // any = 'any', // 一些变量只是内部流转，允许any
  arrayString = 'array[string]',
  arrayNumber = 'array[number]', // double
  arrayBoolean = 'array[boolean]',
  arrayObject = 'array[object]',
  // array = 'array[any]',
}

export type SimpleVarSchema = {
  name: string // 不包含node id
  type: VarType
  desc?: string

  // children?: Var[] // if type is obj, has the children struct
  // isParagraph?: boolean
  // isSelect?: boolean
  // options?: string[]
  // required?: boolean
  // des?: string
  // isException?: boolean
}

export type NodeOutputVar = {
  nodeId: string
  title: string // is it unique, avoid confusing todo 
  vars?: SimpleVarSchema[]
  // type: BlockEnum
}

export type NodeDefault<T=any> = {
  defaultValue: Partial<T>
  getValidPrevNodes: (chatMode: boolean, inIteration: boolean) => BlockEnum[]
  getValidNextNodes: (chatMode: boolean, inIteration: boolean) => BlockEnum[]
  // checkValid: (payload: T, t: any, moreDataForCheckValid?: any) => { isValid: boolean; errorMessage?: string }
  checkValid: (payload: T, moreDataForCheckValid?: any) => { isValid: boolean; errorMessage?: string }
  getOutputVars?: (payload: T) => SimpleVarSchema[] // 获取节点的出参列表
}

export type OnSelectBlock = (type: BlockEnum, dataExtra?: any) => void

export enum WorkflowRunningStatus {
  // Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export enum NodeRunningStatus {
  // NotStart = 'not-start',
  // Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Exception = 'exception',
  // Retry = 'retry',
}

export type OnNodeAdd = (
  newNodePayload: {
    nodeType: BlockEnum
    sourceHandle?: string
    targetHandle?: string
    // toolData?: Pick<ToolNodeType,'tool_name'>
    dataExtra?: any
  },
  oldNodesPayload: {
    prevNodeId?: string
    prevNodeSourceHandle?: string
    nextNodeId?: string
    nextNodeTargetHandle?: string
  }
) => void

export type WorkflowRunningData = {
  task_id?: string
  message_id?: string
  conversation_id?: string
  result: {
    sequence_number?: number
    workflow_id?: string
    inputs?: string
    process_data?: string
    outputs?: string
    status: string
    error?: string
    elapsed_time?: number
    total_tokens?: number
    created_at?: number
    created_by?: string
    finished_at?: number
    steps?: number
    showSteps?: boolean
    total_steps?: number
    // files?: FileResponse[]
    exceptions_count?: number
  }
  // tracing?: NodeTracing[]
}


//选择节点tab里的每个节点
// export type Block = {
//   classification?: string
//   type: BlockEnum
//   title: string
//   // description?: string
// }