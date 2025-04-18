// import type { Branch } from '@/components/workflow/types'
import { ComparisonOperator } from './types'


export const valueLessOperator = (operator: ComparisonOperator) => {
    return [ComparisonOperator.exists, ComparisonOperator.notExists].includes(operator)
}
  
// export const getBranchName = (branches: string[]): Branch[] => {
//     if (!branches?.length) {
//         throw new Error('if-else branch none')
//     }
//     const res = branches.map((id, idx) => {
//         if (idx === 0) {
//             return { id, name: 'if' }
//         }
//         return { id, name: 'elif' }
//     })
//     res.push({ id: 'else', name: 'else' })
//     return res;
//     // const branchLength = branches.length
//     // if (branchLength < 2)
//     //   throw new Error('if-else node branch number must than 2')
  
//     // if (branchLength === 2) {
//     //   return branches.map((branch) => {
//     //     return {
//     //       ...branch,
//     //       name: branch.id === 'false' ? 'ELSE' : 'IF',
//     //     }
//     //   })
//     // }
  
//     // return branches.map((branch, index) => {
//     //   return {
//     //     ...branch,
//     //     name: branch.id === 'false' ? 'ELSE' : `CASE ${index + 1}`,
//     //   }
//     // })
//   }