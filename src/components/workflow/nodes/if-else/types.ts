import type {
    CommonNodeData,
    VarType,
    ValueSelector,
  } from '@/components/workflow/types'

export enum LogicalOperator {
    and = 'and',
    or = 'or',
}

export enum ComparisonOperator {
    contains = 'contains',
    notContains = 'not contains',
    startWith = 'start with',
    endWith = 'end with',
    // is = 'is',
    // isNot = 'is not',
    // empty = 'empty',
    // notEmpty = 'not empty',
    equal = '=',
    notEqual = '≠',
    largerThan = '>',
    lessThan = '<',
    largerThanOrEqual = '≥',
    lessThanOrEqual = '≤',
    // isNull = 'is null',
    // isNotNull = 'is not null',
    in = 'in',
    notIn = 'not in',
    // allOf = 'all of',
    exists = 'exists',
    notExists = 'not exists',
  }

// export type Condition = {
//     // varType: VarType
//     variable_selector?: ValueSelector // ["sys", "app_id"]
//     comparison_operator?: ComparisonOperator
//     value: string | ValueSelector
// }

export type CaseItem = {
    case_id: string // case id，不是展示的if、elif、elif

    // 废弃
    // logical_operator: LogicalOperator
    // conditions?: Condition[]

    // condition?: Condition

    variable_selector?: ValueSelector // ["sys", "app_id"]
    comparison_operator?: ComparisonOperator
    value?: string | ValueSelector
}

export type IfElseNodeType = CommonNodeData & {
    cases: CaseItem[]
}

