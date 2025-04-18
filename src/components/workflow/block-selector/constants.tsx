import type { Block } from '../types'
import { BlockEnum } from '../types'
// import { BlockClassificationEnum } from './types'


// export const BLOCKS: Record<string,string> = {
//   [BlockEnum.Start]: '开始',
//   [BlockEnum.LLM]: 'LLM',
//   [BlockEnum.End]: '结束',
//   [BlockEnum.Answer]: '直接回复',
//   [BlockEnum.IfElse]: '条件分支',
//   [BlockEnum.Iteration]: '迭代',
//   [BlockEnum.Code]: '代码执行',
//   [BlockEnum.VariableAggregator]: '变量聚合',
//   [BlockEnum.Assigner]: '变量赋值',
// }

// 这里的节点不全是因为有些节点是不需要选的
// export const BLOCKS: Block[] = [
//   {
//     // classification: BlockClassificationEnum.Default,
//     type: BlockEnum.Start,
//     title: '开始',
//   },
//   {
//     // classification: BlockClassificationEnum.Default,
//     type: BlockEnum.LLM,
//     title: 'LLM',
//   },
//   // {
//   //   classification: BlockClassificationEnum.Default,
//   //   type: BlockEnum.KnowledgeRetrieval,
//   //   title: '知识检索',
//   // },
//   {
//     // classification: BlockClassificationEnum.Default,
//     type: BlockEnum.End,
//     title: '结束',
//   },
//   {
//     // classification: BlockClassificationEnum.Default,
//     type: BlockEnum.Answer,
//     title: '直接回复',
//   },
//   // {
//   //   classification: BlockClassificationEnum.QuestionUnderstand,
//   //   type: BlockEnum.QuestionClassifier,
//   //   title: '问题分类器',
//   // },
//   {
//     // classification: BlockClassificationEnum.Logic,
//     type: BlockEnum.IfElse,
//     title: '条件分支',
//   },
//   {
//     // classification: BlockClassificationEnum.Logic,
//     type: BlockEnum.Iteration,
//     title: '迭代',
//   },
//   {
//     // classification: BlockClassificationEnum.Transform,
//     type: BlockEnum.Code,
//     title: '代码执行',
//   },
//   // {
//   //   // classification: BlockClassificationEnum.Transform,
//   //   type: BlockEnum.TemplateTransform,
//   //   title: '模板转换',
//   // },
//   {
//     // classification: BlockClassificationEnum.Transform,
//     type: BlockEnum.VariableAggregator,
//     title: '变量聚合器',
//   },
//   // {
//   //   classification: BlockClassificationEnum.Transform,
//   //   type: BlockEnum.DocExtractor,
//   //   title: '文档提取器',
//   // },
//   {
//     type: BlockEnum.Assigner,
//     title: '变量赋值',
//   },
//   // {
//   //   classification: BlockClassificationEnum.Transform,
//   //   type: BlockEnum.ParameterExtractor,
//   //   title: '参数提取器',
//   // },
//   // {
//   //   classification: BlockClassificationEnum.Utilities,
//   //   type: BlockEnum.HttpRequest,
//   //   title: 'HTTP 请求',
//   // },
//   // {
//   //   classification: BlockClassificationEnum.Utilities,
//   //   type: BlockEnum.ListFilter,
//   //   title: '列表操作',
//   // },
// ]

// export const BLOCK_CLASSIFICATIONS: string[] = [
//   BlockClassificationEnum.Default,
//   BlockClassificationEnum.QuestionUnderstand,
//   BlockClassificationEnum.Logic,
//   BlockClassificationEnum.Transform,
//   BlockClassificationEnum.Utilities,
// ]
