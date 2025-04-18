import { useContext } from 'react'
import { useStore } from 'zustand'
import { FeaturesContext } from './context'
import type { FeatureStoreState } from './store'

// 监听store子属性
export function useFeatures<T>(selector: (state: FeatureStoreState) => T): T {
  const store = useContext(FeaturesContext)
  if (!store)
    throw new Error('Missing FeaturesContext.Provider in the tree')

  return useStore(store, selector)
}

// 监听store
export function useFeaturesStore() {
  return useContext(FeaturesContext)
}
