'use client'
// import { useUnmount } from 'ahooks'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import cn from '@/utils/classnames'
import { useStore as useAppStore } from '@/components/app/store'
import constStore from '@/components/base/system-config-store'
import { Spin } from 'antd'
import { fetchAppDetail } from '@/services/apps'

export type IAppDetailLayoutProps = {
  children: React.ReactNode
  params: { appId: string }
}

const AppDetailLayout = (props: IAppDetailLayoutProps) => {
  const {
    children,
    params: { appId }, // get appId in path
  } = props
  const router = useRouter()
  const appDetail = useAppStore(state => state.appDetail)

  useEffect(() => {
    constStore.getState().fetchModels()
    constStore.getState().fetchAllTools()
  }, [])

  useEffect(() => {
    useAppStore.getState().setAppDetail()
    fetchAppDetail({ url: '/apps', id: appId }).then((res) => {
      useAppStore.getState().setAppDetail(res)
    }).catch((e: any) => {
      if (e.status === 404)
        router.replace('/workflows')
    })
  }, [appId, router])

  if (!appDetail) {
    return (
      <div className='flex h-full items-center justify-center bg-background-body'>
        <Spin />
      </div>
    )
  }

  return (
    <div className={cn('flex', 'h-full', 'overflow-hidden')}>
      <div className="bg-components-panel-bg grow overflow-hidden">
        {children}
      </div>
    </div>
  )
}
export default React.memo(AppDetailLayout)
