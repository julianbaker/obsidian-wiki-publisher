'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

export function StubLinkHandler({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const link = target.closest('a.stub-link')

            if (link) {
                e.preventDefault()
                const linkText = link.textContent || 'This page'
                toast.info(`${linkText} is a stub`, {
                    description: 'This page hasn\'t been created yet.',
                    duration: 3000,
                })
            }
        }

        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    return <>{children}</>
}

