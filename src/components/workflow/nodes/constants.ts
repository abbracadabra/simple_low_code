import StartNodeDefault from './start/default'
import AnswerDefault from './answer/default'
import LLMDefault from './llm/default'
import IfElseDefault from './if-else/default'
import CodeDefault from './code/default'
import ToolDefault from './tool/default'
import VariableAggregatorDefault from './variable-aggregator/default'
import AssignerDefault from './assigner/default'
import EndNodeDefault from './end/default'
import IterationDefault from './iteration/default'
import IterationStartDefault from './iteration-start/default'
import { BlockEnum, SimpleVarSchema } from '../types'

type NodesExtra = {
    about: string
    getValidPrevNodes: (chatMode: boolean, inIteration: boolean) => BlockEnum[]
    getValidNextNodes: (chatMode: boolean, inIteration: boolean) => BlockEnum[]
    checkValid: any,
    title: string,
    getOutputVars?: (payload: any) => SimpleVarSchema[]
}

const NODES_EXTRA_INFO: Record<BlockEnum, NodesExtra> = {
    [BlockEnum.Start]: {
      title: "开始",
      about: "定义一个 workflow 流程启动的初始参数",
      getValidPrevNodes: StartNodeDefault.getValidPrevNodes,
      getValidNextNodes: StartNodeDefault.getValidNextNodes,
      checkValid: StartNodeDefault.checkValid,
      getOutputVars: StartNodeDefault.getOutputVars
    },
    [BlockEnum.End]: {
      title: '结束',
      about: "定义一个 workflow 流程的结束和结果类型",
      getValidPrevNodes: EndNodeDefault.getValidPrevNodes,
      getValidNextNodes: EndNodeDefault.getValidNextNodes,
      checkValid: EndNodeDefault.checkValid,
      getOutputVars: EndNodeDefault.getOutputVars
    },
    [BlockEnum.Answer]: {
      title: '回复',
      about: "定义一个聊天对话的回复内容",
      getValidPrevNodes: AnswerDefault.getValidPrevNodes,
      getValidNextNodes: AnswerDefault.getValidNextNodes,
      checkValid: AnswerDefault.checkValid,
      getOutputVars: AnswerDefault.getOutputVars
    },
    [BlockEnum.LLM]: {
      title: 'LLM',
      about: "调用大语言模型回答问题或者对自然语言进行处理",
      getValidPrevNodes: LLMDefault.getValidPrevNodes,
      getValidNextNodes: LLMDefault.getValidNextNodes,
      checkValid: LLMDefault.checkValid,
      getOutputVars: LLMDefault.getOutputVars
    },
    [BlockEnum.IfElse]: {
      title: "条件分支",
      about: "允许你根据 if/else 条件将 workflow 拆分成两个分支",
      getValidPrevNodes: IfElseDefault.getValidPrevNodes,
      getValidNextNodes: IfElseDefault.getValidNextNodes,
      checkValid: IfElseDefault.checkValid,
      getOutputVars: IfElseDefault.getOutputVars,
    },
    [BlockEnum.Code]: {
      title: '代码执行',
      about: "执行一段 Python 或 NodeJS 代码实现自定义逻辑",
      getValidPrevNodes: CodeDefault.getValidPrevNodes,
      getValidNextNodes: CodeDefault.getValidNextNodes,
      checkValid: CodeDefault.checkValid,
      getOutputVars: CodeDefault.getOutputVars,
    },
    [BlockEnum.VariableAggregator]: {
      title: '变量聚合',
      about: "将多路分支的变量聚合为一个变量，以实现下游节点统一配置。",
      getValidPrevNodes: VariableAggregatorDefault.getValidPrevNodes,
      getValidNextNodes: VariableAggregatorDefault.getValidNextNodes,
      checkValid: VariableAggregatorDefault.checkValid,
      getOutputVars: VariableAggregatorDefault.getOutputVars,
    },
    [BlockEnum.Tool]: {
      title: '', // 工具有自己的描述和title
      about: '',
      getValidPrevNodes: ToolDefault.getValidPrevNodes,
      getValidNextNodes: ToolDefault.getValidNextNodes,
      checkValid: ToolDefault.checkValid,
      getOutputVars: ToolDefault.getOutputVars,
    },
    [BlockEnum.Iteration]: {
      title: '迭代',
      about: "对列表对象执行多次步骤直至输出所有结果。",
      getValidPrevNodes: IterationDefault.getValidPrevNodes,
      getValidNextNodes: IterationDefault.getValidNextNodes,
      checkValid: IterationDefault.checkValid,
      getOutputVars: IterationDefault.getOutputVars,
    },
    [BlockEnum.IterationStart]: {
      title: '迭代开始',
      about: '迭代开始',
      getValidPrevNodes: IterationStartDefault.getValidPrevNodes,
      getValidNextNodes: IterationStartDefault.getValidNextNodes,
      checkValid: IterationStartDefault.checkValid,
      getOutputVars: IterationStartDefault.getOutputVars,
    },
    [BlockEnum.Assigner]: {
      title: '变量赋值',
      about: '变量赋值',
      getValidPrevNodes: AssignerDefault.getValidPrevNodes,
      getValidNextNodes: AssignerDefault.getValidNextNodes,
      checkValid: AssignerDefault.checkValid,
      getOutputVars: AssignerDefault.getOutputVars,
    },
}

const NODES_INITIAL_DATA = {
    [BlockEnum.Start]: {
        type: BlockEnum.Start,
        title: '',
        desc: '',
        ...StartNodeDefault.defaultValue,
    },
    [BlockEnum.End]: {
        type: BlockEnum.End,
        title: '',
        desc: '',
        ...EndNodeDefault.defaultValue,
    },
    [BlockEnum.Answer]: {
        type: BlockEnum.Answer,
        title: '',
        desc: '',
        ...AnswerDefault.defaultValue,
    },
    [BlockEnum.LLM]: {
        type: BlockEnum.LLM,
        title: '',
        desc: '',
        variables: [],
        ...LLMDefault.defaultValue,
    },
    [BlockEnum.IfElse]: {
        type: BlockEnum.IfElse,
        title: '',
        desc: '',
        ...IfElseDefault.defaultValue,
    },
    [BlockEnum.Code]: {
        type: BlockEnum.Code,
        title: '',
        desc: '',
        variables: [],
        code_language: 'python3',
        code: '',
        outputs: [],
        ...CodeDefault.defaultValue,
    },
    [BlockEnum.VariableAggregator]: {
        type: BlockEnum.VariableAggregator,
        title: '',
        desc: '',
        variables: [],
        output_type: '',
        ...VariableAggregatorDefault.defaultValue
    },
    [BlockEnum.Tool]: {
        type: BlockEnum.Tool,
        title: '',
        desc: '',
        ...ToolDefault.defaultValue,
    },
    [BlockEnum.Iteration]: {
        type: BlockEnum.Iteration,
        title: '',
        desc: '',
        ...IterationDefault.defaultValue,
    },
    [BlockEnum.IterationStart]: {
        type: BlockEnum.IterationStart,
        title: '',
        desc: '',
        ...IterationStartDefault.defaultValue,
    },
    [BlockEnum.Assigner]: {
        type: BlockEnum.Assigner,
        title: '',
        desc: '',
        ...AssignerDefault.defaultValue,
    }
}

export { NODES_EXTRA_INFO, NODES_INITIAL_DATA }