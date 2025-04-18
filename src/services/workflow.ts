import type {
    FetchWorkflowDraftResponse,
  } from '@/types/workflow'
import { get, post } from './base'
import type { CommonResponse } from '@/models/common'

// 获取草稿 todo 
export const fetchWorkflowDraft = (url: string) => {
    return Promise.resolve<FetchWorkflowDraftResponse>({
        graph: {
            nodes: [],
            edges: [],
        },
        created_at: 0,
        updated_at: 0,
    })
    // return get<FetchWorkflowDraftResponse>(url, {}) 
}

// 保存草稿todo 
export const syncWorkflowDraft = ({ url, params }: { url: string; params: Pick<FetchWorkflowDraftResponse, 'graph' | 'features' | 'environment_variables' | 'conversation_variables'> }) => {
    return Promise.resolve({
        success: true,
        code: 0,
        result: {
            updated_at: 0,
            hash: '',
        },
    } as CommonResponse<{ updated_at: number; hash: string }> & { updated_at: number; hash: string })
    // return post<CommonResponse<{ updated_at: number; hash: string }> & { updated_at: number; hash: string }>(url, { body: params })
}