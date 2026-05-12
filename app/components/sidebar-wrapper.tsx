'use client'

import { usePathname } from 'next/navigation'
import { WikiSidebar } from './wiki-sidebar'

interface FolderNode {
    name: string
    posts: Array<{
        slug: string
        routePath: string
        metadata: {
            title: string
        }
    }>
    subfolders: Record<string, FolderNode>
}

interface SidebarWrapperProps {
    structure: Record<string, FolderNode>
}

export function SidebarWrapper({ structure }: SidebarWrapperProps) {
    const pathname = usePathname()

    // Extract current route path without leading slash (e.g., /docs/getting-started -> docs/getting-started)
    const currentPath = pathname.startsWith('/')
        ? pathname.slice(1)
        : undefined

    return <WikiSidebar structure={structure} currentPath={currentPath} />
}
