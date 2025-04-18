import {   get  } from './base'
import {App, AppMode} from '@/types/app'

// 获取app详情 todo mock
export const fetchAppDetail = ({ url, id }: { url: string; id: string }) => {
    return Promise.resolve({
        id: '1',
        mode: AppMode.chatflow
    } as App)
    // return get<App>(`${url}/${id}`)
}