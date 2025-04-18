import { useCallback, useContext } from 'react'
import { useStoreApi } from 'reactflow'
import { message } from "antd"
import { BlockEnum } from '../types'
import produce from 'immer'
import {
  useNodesReadOnly,
} from './use-workflow'
import { syncWorkflowDraft } from '@/services/workflow'
import { useFeaturesStore } from '@/components/base/features/hooks'
// import {
//     useWorkflowStore,
//   } from '../store'
import { useWorkflowDraftStore, WorkflowDraftStoreContext } from '@/components/workflow/context' 

export const useNodesSyncDraft = () => {
    const store = useStoreApi()
    // const workflowStore = useWorkflowStore()
    const workflowStore = useContext(WorkflowDraftStoreContext)!
    const featuresStore = useFeaturesStore()
    const { getNodesReadOnly } = useNodesReadOnly()

    //获取工作流数据，发送体
    const getPostParams = useCallback(() => {
        const {
          getNodes,
          edges,
          transform,
        } = store.getState()
        const [x, y, zoom] = transform
        const {
          appId,
          conversationVariables,
          environmentVariables,
          // syncWorkflowDraftHash,
        } = workflowStore.getState()
    
        if (appId) {
          const nodes = getNodes()
          const hasStartNode = nodes.find(node => node.data.type === BlockEnum.Start)
    
          if (!hasStartNode)
            return
    
          const features = featuresStore!.getState().features
          const producedNodes = produce(nodes, (draft) => {
            draft.forEach((node) => {
              Object.keys(node.data).forEach((key) => {
                if (key.startsWith('_'))
                  delete node.data[key]
              })
            })
          })
          const producedEdges = produce(edges, (draft) => {
            draft.forEach((edge) => {
              Object.keys(edge.data).forEach((key) => {
                if (key.startsWith('_'))
                  delete edge.data[key]
              })
            })
          })
          return {
            url: `/apps/${appId}/workflows/draft`,
            params: {
              graph: {
                nodes: producedNodes,
                edges: producedEdges,
                viewport: {
                  x,
                  y,
                  zoom,
                },
              },
              // features: {
                // opening_statement: features.opening?.enabled ? (features.opening?.opening_statement || '') : '', // chat开场白
                // suggested_questions: features.opening?.enabled ? (features.opening?.suggested_questions || []) : [], // 建议问题
                // suggested_questions_after_answer: features.suggested, // 建议的追加问题
                // text_to_speech: features.text2speech,
                // speech_to_text: features.speech2text,
                // retriever_resource: features.citation,
                // sensitive_word_avoidance: features.moderation,
                // file_upload: features.file,
              // },
              environment_variables: environmentVariables,
              conversation_variables: conversationVariables,
              // hash: syncWorkflowDraftHash,
            },
          }
        }
      }, [store, featuresStore, workflowStore])


    const doSyncWorkflowDraft = useCallback(async () => {
        if (getNodesReadOnly())
          return
        const postParams = getPostParams() //工作流数据
    
        if (postParams) {
          // const {
          //   setSyncWorkflowDraftHash,
          //   // setDraftUpdatedAt,
          // } = workflowStore.getState()
          try {
            const res = await syncWorkflowDraft(postParams)
            // const res = { hash:'1' }
            // setSyncWorkflowDraftHash(res.hash)
            // setDraftUpdatedAt(res.updated_at)
          }
          catch (error: any) {
            if (error && error.json && !error.bodyUsed) {
              error.json().then((err: any) => {
                message.warning('保存失败，'+err.code)
                // if (err.code === 'draft_workflow_not_sync' && !notRefreshWhenSyncError)
                //   handleRefreshWorkflowDraft()
              })
            }
          }
        }
    }, [workflowStore, getPostParams])

    const debouncedSyncWorkflowDraft = useWorkflowDraftStore(s => s.debouncedSyncWorkflowDraft)

    // 有防抖
    const handleSyncWorkflowDraft = useCallback((syncNow?: boolean) => {
        if (getNodesReadOnly())
          return

        if (syncNow) {
          doSyncWorkflowDraft()
        } else {
          debouncedSyncWorkflowDraft(doSyncWorkflowDraft)
        }
    }, [doSyncWorkflowDraft,debouncedSyncWorkflowDraft])

    return {
        doSyncWorkflowDraft, // 直接存db
        handleSyncWorkflowDraft, // 有防抖
      }
}
    