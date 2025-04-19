import type {
    BlockEnum,
    CommonNodeData,
    // ErrorHandleMode,
    ValueSelector,
    VarType,
  } from '@/components/workflow/types'

export type IterationNodeType = CommonNodeData & {
    start_node_id: string // 长得像home房子的固定节点
    iterator_selector: ValueSelector // 选择输入变量
    output_selector: ValueSelector // 选择输出变量
    output_type: VarType   // 输出类型，这里是套上array[]的  为什么要存？？
    is_parallel: boolean  // 是否并行遍历
    parallel_nums: number  // 并行遍历数
    // error_handle_mode: ErrorHandleMode // how to handle error in the iteration
    // _isShowTips: boolean // when answer node in parallel mode iteration show tips
  }
  