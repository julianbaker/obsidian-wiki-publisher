'use client'

import Link from 'next/link'
import { siteName, siteConfig } from 'lib/site-config'
import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, FileText, Folder, Menu, Network } from 'lucide-react'
import { cn, slugify } from 'lib/utils'
import { GraphViewModal } from './graph-view-modal'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from './ui/sidebar'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from './ui/sheet'
import { Button } from './ui/button'

interface Post {
    slug: string
    metadata: {
        title: string
    }
}

interface FolderNode {
    name: string
    posts: Post[]
    subfolders: Record<string, FolderNode>
}

interface WikiSidebarProps {
    structure: Record<string, FolderNode>
    currentSlug?: string
}

function FolderItem({
    name,
    posts,
    subfolders,
    level = 0,
    currentSlug,
    onNavigate
}: FolderNode & { level?: number; currentSlug?: string; onNavigate?: () => void }) {
    const hasSubfolders = Object.keys(subfolders).length > 0

    // Find the folder note (file named same as folder, e.g., "1. Core.md" in "1. Core" folder)
    const folderBaseName = slugify(name)
    const folderNote = posts.find(post => post.slug === folderBaseName)

    const childPosts = posts.filter(post => post.slug !== folderBaseName)

    // Recursively check if current slug is within this folder tree
    const containsCurrentSlug = (folderData: FolderNode, slug?: string): boolean => {
        if (!slug) return false

        const baseName = slugify(folderData.name)
        const note = folderData.posts.find(post => post.slug === baseName)

        // Check if it's the folder note
        if (note?.slug === slug) return true

        // Check if it's any other post in this folder
        const children = folderData.posts.filter(post => post.slug !== baseName)
        if (children.some(post => post.slug === slug)) return true

        // Recursively check subfolders
        for (const subfolder of Object.values(folderData.subfolders)) {
            if (containsCurrentSlug(subfolder, slug)) return true
        }

        return false
    }

    const shouldBeOpen = containsCurrentSlug({ name, posts, subfolders }, currentSlug)
    const [isOpen, setIsOpen] = useState(shouldBeOpen)

    // Update isOpen when navigating to/from pages in this folder
    useEffect(() => {
        if (shouldBeOpen) {
            setIsOpen(true)
        }
    }, [shouldBeOpen])

    return (
        <SidebarMenuItem>
            {folderNote ? (
                <Link
                    href={`/${folderNote.slug}`}
                    onClick={onNavigate}
                    className={cn(
                        "flex items-center gap-2 h-9 px-2 rounded-md hover:bg-accent transition-colors group",
                        level === 0 && "font-semibold",
                        currentSlug === folderNote.slug && "bg-accent font-medium"
                    )}
                >
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsOpen(!isOpen)
                        }}
                        className="p-0 hover:bg-transparent"
                    >
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        )}
                    </button>
                    <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{name}</span>
                </Link>
            ) : (
                <SidebarMenuButton
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(level === 0 && "font-semibold")}
                >
                    {isOpen ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                    ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                    )}
                    <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{name}</span>
                </SidebarMenuButton>
            )}

            {isOpen && (childPosts.length > 0 || hasSubfolders) && (
                <SidebarMenuSub>
                    {childPosts.map((post) => (
                        <SidebarMenuSubItem key={post.slug}>
                            <Link
                                href={`/${post.slug}`}
                                onClick={onNavigate}
                                className={cn(
                                    "flex h-7 items-center gap-2 overflow-hidden rounded-md px-2 text-sm outline-none ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors",
                                    currentSlug === post.slug && "bg-accent font-medium text-accent-foreground"
                                )}
                            >
                                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{post.metadata.title}</span>
                            </Link>
                        </SidebarMenuSubItem>
                    ))}

                    {hasSubfolders && Object.entries(subfolders).map(([folderName, folder]) => (
                        <FolderItem
                            key={folderName}
                            {...folder}
                            level={level + 1}
                            currentSlug={currentSlug}
                            onNavigate={onNavigate}
                        />
                    ))}
                </SidebarMenuSub>
            )}
        </SidebarMenuItem>
    )
}

function SidebarNav({ structure, currentSlug, onNavigate, isMobile, onGraphOpen }: WikiSidebarProps & { onNavigate?: () => void; isMobile?: boolean; onGraphOpen?: () => void }) {
    const handleGraphOpen = () => {
        onGraphOpen?.()
        onNavigate?.() // Close mobile sidebar when opening graph
    }

    return (
        <>
            <SidebarHeader className={isMobile ? "pt-6" : ""}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <Link
                            href="/"
                            className="text-lg font-bold hover:opacity-80 transition-opacity block"
                            onClick={onNavigate}
                        >
                            {siteName}
                        </Link>
                        {siteConfig.tagline && (
                            <p className="text-xs text-muted-foreground">{siteConfig.tagline}</p>
                        )}
                    </div>
                    {!isMobile && (
                        <button
                            onClick={handleGraphOpen}
                            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
                            title="Graph View"
                            aria-label="Open graph view"
                        >
                            <Network size={18} />
                        </button>
                    )}
                </div>
                {isMobile && (
                    <button
                        onClick={handleGraphOpen}
                        className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-muted hover:bg-accent transition-colors text-sm font-medium touch-manipulation"
                    >
                        <Network size={18} />
                        <span>View Graph</span>
                    </button>
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Render root-level pages as top-level items */}
                            {structure['Root']?.posts?.filter((post) => post && post.slug !== 'index').map((post) => (
                                <SidebarMenuItem key={post.slug}>
                                    <Link
                                        href={`/${post.slug}`}
                                        onClick={onNavigate}
                                        className={cn(
                                            'flex h-9 items-center gap-2 overflow-hidden rounded-md px-2 text-sm outline-none ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors',
                                            currentSlug === post.slug && 'bg-accent font-medium text-accent-foreground'
                                        )}
                                    >
                                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span className="truncate">{post.metadata.title}</span>
                                    </Link>
                                </SidebarMenuItem>
                            ))}

                            {/* Render all other folders (excluding Root) */}
                            {Object.entries(structure)
                                .filter(([folderName]) => folderName !== 'Root')
                                .map(([folderName, folder]) => (
                                    <FolderItem
                                        key={folderName}
                                        {...folder}
                                        currentSlug={currentSlug}
                                        onNavigate={onNavigate}
                                    />
                                ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </>
    )
}

export function WikiSidebar({ structure, currentSlug }: WikiSidebarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isGraphOpen, setIsGraphOpen] = useState(false)

    return (
        <>
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:flex">
                <SidebarNav
                    structure={structure}
                    currentSlug={currentSlug}
                    isMobile={false}
                    onGraphOpen={() => setIsGraphOpen(true)}
                />
            </Sidebar>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden fixed top-4 left-4 z-40 shadow-lg touch-manipulation"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] max-w-[340px] p-0">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-y-auto">
                            <SidebarNav
                                structure={structure}
                                currentSlug={currentSlug}
                                onNavigate={() => setIsMobileOpen(false)}
                                onGraphOpen={() => setIsGraphOpen(true)}
                                isMobile={true}
                            />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Graph View Modal - outside Sheet so it persists */}
            <GraphViewModal isOpen={isGraphOpen} onClose={() => setIsGraphOpen(false)} />
        </>
    )
}

