'use client'
import Workflow from '@/components/workflow'
import cn from '@/utils/classnames'
import { useEffect } from 'react'

const Page = () => {
    return (
        <div className='w-full h-full overflow-x-auto'>
            <Workflow />
        </div>
    )
}

export default Page
