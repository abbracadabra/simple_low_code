import type { FC } from 'react'
import {
  memo,
  useRef,
} from 'react'
// import type { NodeProps } from 'reactflow'
import type { NodeProps } from '@/components/workflow/types'
// import { useTranslation } from 'react-i18next'
// import NodeGroupItem from './components/node-group-item'
import { VariableAggregateNodeType } from './types'
import { useNodeTitle } from '../../hooks'
// import type { VariableAssignerNodeType } from './types'

// const i18nPrefix = 'workflow.nodes.variableAssigner'

const Node: FC<NodeProps<VariableAggregateNodeType>> = ({
  data,
}) => {
  const { getNodeTitle } = useNodeTitle()
  // const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const { groups } = data

  // const xxx = useMemo(() => {
    // if (!advanced_settings?.group_enabled) {
    //   return [{
    //     groupEnabled: false,
    //     targetHandleId: 'target',
    //     title: t(`${i18nPrefix}.title`),
    //     type: data.output_type,
    //     variables: data.variables,
    //     variableAssignerNodeId: id,
    //     variableAssignerNodeData: data,
    //   }]
    // }
    // return groups.map((group) => {
    //   return {
    //     // groupEnabled: true,
    //     // targetHandleId: group.groupId,
    //     title: group.name,
    //     type: group.output_type,
    //     variables: group.variables,
    //     variableAssignerNodeId: id,
    //     variableAssignerNodeData: data,
    //   }
    // })
  // }, [t, groups, data, id])

  return (
    <div className='relative mb-1 px-1 space-y-0.5' ref={ref}>
      {
        groups.map((item, i) => {
          return (
            <div key={i}>
              <div><span>{item.name}</span>&nbsp;<span>{item.output_type}</span></div>
              {item.variables.map((v,vi)=>{
                return <div key={vi}>{getNodeTitle(v[0]) + '/' + v.slice(1).join('.')}</div>
              })}
            </div>
          )
        })
      }
    </div >
  )
}

export default memo(Node)
