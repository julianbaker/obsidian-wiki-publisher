'use client'

import { usePathname } from 'next/navigation'
import { WikiSidebar } from './wiki-sidebar'

interface FolderNode {
    name: string
    posts: Array<{
        slug: string
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

    // Extract slug from pathname (e.g., /some-slug -> some-slug)
    const currentSlug = pathname.startsWith('/')
        ? pathname.slice(1)
        : undefined

    return <WikiSidebar structure={structure} currentSlug={currentSlug} />
}

