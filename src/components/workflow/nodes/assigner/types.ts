import type { CommonNodeData, ValueSelector } from '@/components/workflow/types'

export enum WriteMode {
  // overwrite = 'over-write',
  clear = 'clear',
  // append = 'append',
  // extend = 'extend',
  set = 'set',
  // increment = '+=',
  // decrement = '-=',
  // multiply = '*=',
  // divide = '/=',
}

export enum AssignerNodeInputType {
  variable = 'variable',
  constant = 'constant',
}

export type AssignerNodeOperation = {
  varToBeAssigned: ValueSelector // 会话变量选择  ["conversation", "er"]
  operation: WriteMode // set、清空
  // clear: boolean,
  // input_type: AssignerNodeInputType // 常量、引用变量、清空
  // value: string | ValueSelector // 常量、["1741312007189", "sdasd"]
  value: ValueSelector // 常量、["1741312007189", "sdasd"]
}

export type AssignerNodeType = CommonNodeData & {
  // version?: '1' | '2'
  items: AssignerNodeOperation[]
}
