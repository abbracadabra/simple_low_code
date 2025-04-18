import { create } from 'zustand'
import type { App } from '@/types/app'

type State = {
    // appDetail?: App & Partial<AppSSO>
    appDetail?: App
    // appSidebarExpand: string
    // currentLogItem?: IChatItem
    // currentLogModalActiveTab: string
    // showPromptLogModal: boolean
    // showAgentLogModal: boolean
    // showMessageLogModal: boolean
    // showAppConfigureFeaturesModal: boolean
  }

  type Action = {
    // setAppDetail: (appDetail?: App & Partial<AppSSO>) => void
    setAppDetail: (appDetail?: App) => void
    // setAppSiderbarExpand: (state: string) => void
    // setCurrentLogItem: (item?: IChatItem) => void
    // setCurrentLogModalActiveTab: (tab: string) => void
    // setShowPromptLogModal: (showPromptLogModal: boolean) => void
    // setShowAgentLogModal: (showAgentLogModal: boolean) => void
    // setShowMessageLogModal: (showMessageLogModal: boolean) => void
    // setShowAppConfigureFeaturesModal: (showAppConfigureFeaturesModal: boolean) => void
  }

/**
 * store里是些基础数据，workflowStore是画布页面的数据，store是其他页面和workflow页面都要用的
 */
export const useStore = create<State & Action>(set => ({
    appDetail: undefined,
    setAppDetail: appDetail => set(() => ({ appDetail })),
    // appSidebarExpand: '',
    // setAppSiderbarExpand: appSidebarExpand => set(() => ({ appSidebarExpand })),
    // currentLogItem: undefined,
    // currentLogModalActiveTab: 'DETAIL',
    // setCurrentLogItem: currentLogItem => set(() => ({ currentLogItem })),
    // setCurrentLogModalActiveTab: currentLogModalActiveTab => set(() => ({ currentLogModalActiveTab })),
    // showPromptLogModal: false,
    // setShowPromptLogModal: showPromptLogModal => set(() => ({ showPromptLogModal })),
    // showAgentLogModal: false,
    // setShowAgentLogModal: showAgentLogModal => set(() => ({ showAgentLogModal })),
    // showMessageLogModal: false,
    // setShowMessageLogModal: showMessageLogModal => set(() => {
    //   if (showMessageLogModal) {
    //     return { showMessageLogModal }
    //   }
    //   else {
    //     return {
    //       showMessageLogModal,
    //       currentLogModalActiveTab: 'DETAIL',
    //     }
    //   }
    // }),
    // showAppConfigureFeaturesModal: false,
    // setShowAppConfigureFeaturesModal: showAppConfigureFeaturesModal => set(() => ({ showAppConfigureFeaturesModal })),
  }))
  