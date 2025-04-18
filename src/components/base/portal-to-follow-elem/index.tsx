import React from 'react'
import {
    FloatingPortal,
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useMergeRefs,
    useRole,
  } from '@floating-ui/react'

import type { OffsetOptions, Placement } from '@floating-ui/react'
import cn from '@/utils/classnames'

export type PortalToFollowElemOptions = {
    /*
    * top, bottom, left, right
    * start, end. Default is middle
    * combine: top-start, top-end
    */
    placement?: Placement
    open?: boolean
    offset?: number | OffsetOptions
    onOpenChange?: (open: boolean) => void
  }

  // float容器的一些属性
  export function usePortalToFollowElem({
    placement = 'bottom',
    open,
    offset: offsetValue = 0,
    onOpenChange: setControlledOpen,
  }: PortalToFollowElemOptions = {}) {
    const setOpen = setControlledOpen
  
    const data = useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(offsetValue),
        flip({
          crossAxis: placement.includes('-'),
          fallbackAxisSideDirection: 'start',
          padding: 5,
        }),
        shift({ padding: 5 }),
      ],
    })
  
    const context = data.context
  
    const hover = useHover(context, {
      move: false,
      enabled: open === null,
    })
    const focus = useFocus(context, {
      enabled: open === null,
    })
    const dismiss = useDismiss(context)
    const role = useRole(context, { role: 'tooltip' })
  
    const interactions = useInteractions([hover, focus, dismiss, role])
  
    return React.useMemo(
      () => ({
        open,
        setOpen,
        ...interactions,
        ...data,
      }),
      [open, setOpen, interactions, data],
    )
  }

  // 上下文context
type ContextType = ReturnType<typeof usePortalToFollowElem> | null
const PortalToFollowElemContext = React.createContext<ContextType>(null)
export function PortalToFollowElem({
  children,
  ...options
}: { children: React.ReactNode } & PortalToFollowElemOptions) {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = usePortalToFollowElem(options) // float容器的一些属性
  return (
      <PortalToFollowElemContext.Provider value={tooltip}>
        {children}
      </PortalToFollowElemContext.Provider>
    )
}
export function usePortalToFollowElemContext() {
  const context = React.useContext(PortalToFollowElemContext)

  if (context === null)
    throw new Error('PortalToFollowElem components must be wrapped in <PortalToFollowElem />')

  return context
}


  export const PortalToFollowElemTrigger = React.forwardRef<
HTMLElement,
React.HTMLProps<HTMLElement> & { asChild?: boolean }
>(({ children, asChild = false, ...props }, propRef) => {
  const context = usePortalToFollowElemContext()
  const childrenRef = (children as any).ref
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      }),
    )
  }

  return (
    <div
      ref={ref}
      className={cn('inline-block', props.className)}
      // The user can style the trigger based on the state
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </div>
  )
})
PortalToFollowElemTrigger.displayName = 'PortalToFollowElemTrigger'


// 悬浮容器
export const PortalToFollowElemContent = React.forwardRef<
HTMLDivElement,
React.HTMLProps<HTMLDivElement>
>(({ style, ...props }, propRef) => {
  const context = usePortalToFollowElemContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef]) // 给两个ref来set

  if (!context.open)
    return null

  const body = document.body

  return (
    <FloatingPortal root={body}>
      <div
        ref={ref} // 操控元素进行float
        style={{
          ...context.floatingStyles,
          ...style,
        }}
        {...context.getFloatingProps(props)} // props有children
      />
    </FloatingPortal>
  )
})

PortalToFollowElemContent.displayName = 'PortalToFollowElemContent'