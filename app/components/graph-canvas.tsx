'use client'

import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading graph...</div>
        </div>
    ),
})

export interface GraphNode {
    id: string
    title: string
    folder: string
}

export interface GraphLink {
    source: string
    target: string
}

export interface GraphData {
    nodes: GraphNode[]
    links: GraphLink[]
}

// After the force simulation resolves, source/target become node objects with x/y coords
type SimNode = GraphNode & { x: number; y: number }
type SimLink = Omit<GraphLink, 'source' | 'target'> & { source: SimNode; target: SimNode }

// Narrowed handle — only the methods we actually call on the ForceGraph instance
interface GraphHandle {
    zoom(level?: number, durationMs?: number): number
    zoomToFit(durationMs?: number, padding?: number): void
}

interface GraphCanvasProps {
    graphData: GraphData
    onNodeClick: (node: GraphNode) => void
}

export function GraphCanvas({ graphData, onNodeClick }: GraphCanvasProps) {
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
    const [highlightNodes, setHighlightNodes] = useState(new Set<string>())
    const [highlightLinks, setHighlightLinks] = useState(new Set<string>())
    const graphRef = useRef<GraphHandle | null>(null)

    // Client-only: CSS variables are not available during SSR
    const styles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
    const primaryColor = styles?.getPropertyValue('--primary').trim() || '#d97706'
    const mutedColor = styles?.getPropertyValue('--muted-foreground').trim() || '#6b7280'
    const borderColor = styles?.getPropertyValue('--border').trim() || '#94a3b8'

    const handleNodeHover = useCallback((node: GraphNode | null) => {
        setHoveredNode(node)

        if (!node) {
            setHighlightNodes(new Set())
            setHighlightLinks(new Set())
            return
        }

        const nodes = new Set<string>([node.id])
        const links = new Set<string>()

        graphData.links.forEach(link => {
            // After simulation, source/target are resolved node objects; fall back to the raw string
            const s = ((link.source as unknown) as SimNode).id ?? (link.source as unknown as string)
            const t = ((link.target as unknown) as SimNode).id ?? (link.target as unknown as string)
            if (s === node.id) { nodes.add(t); links.add(`${s}-${t}`) }
            if (t === node.id) { nodes.add(s); links.add(`${s}-${t}`) }
        })

        setHighlightNodes(nodes)
        setHighlightLinks(links)
    }, [graphData])

    const handleZoomIn = () => {
        const g = graphRef.current
        if (g) g.zoom(g.zoom() * 1.5, 400)
    }

    const handleZoomOut = () => {
        const g = graphRef.current
        if (g) g.zoom(g.zoom() / 1.5, 400)
    }

    const handleFit = () => graphRef.current?.zoomToFit(400, 50)

    return (
        <div className="relative w-full h-full">
            {/* Zoom controls — bottom-right on mobile, top-right on desktop */}
            <div className="absolute bottom-4 right-4 md:bottom-auto md:top-4 z-10 flex flex-row md:flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="p-3 bg-card border border-border rounded-lg hover:bg-accent active:bg-muted transition-colors shadow-lg touch-manipulation"
                    title="Zoom In"
                    aria-label="Zoom in"
                >
                    <ZoomIn size={20} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-3 bg-card border border-border rounded-lg hover:bg-accent active:bg-muted transition-colors shadow-lg touch-manipulation"
                    title="Zoom Out"
                    aria-label="Zoom out"
                >
                    <ZoomOut size={20} />
                </button>
                <button
                    onClick={handleFit}
                    className="p-3 bg-card border border-border rounded-lg hover:bg-accent active:bg-muted transition-colors shadow-lg touch-manipulation"
                    title="Fit to Screen"
                    aria-label="Fit graph to screen"
                >
                    <Maximize2 size={20} />
                </button>
            </div>

            {hoveredNode && (
                <div className="absolute top-4 left-4 z-10 p-3 md:p-4 bg-card border border-border rounded-lg shadow-lg max-w-sm">
                    <div className="font-semibold text-base md:text-lg mb-1 truncate">{hoveredNode.title}</div>
                    <div className="text-xs md:text-sm text-muted-foreground truncate">
                        {hoveredNode.folder || 'Root'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 md:mt-2">
                        Click to view page
                    </div>
                </div>
            )}

            {/* The force graph — ref is cast because the library's exported ref type is more complex
                than the subset of methods we actually need. */}
            <ForceGraph2D
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={graphRef as any}
                graphData={graphData}
                nodeLabel={(node) => (node as GraphNode).title}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const simNode = node as SimNode
                    const fontSize = 12 / globalScale
                    const nodeSize = 4
                    const isHighlighted = !hoveredNode || highlightNodes.has(simNode.id)
                    const opacity = isHighlighted ? 1 : 0.15

                    ctx.beginPath()
                    ctx.arc(simNode.x, simNode.y, nodeSize, 0, 2 * Math.PI, false)
                    ctx.globalAlpha = opacity
                    ctx.fillStyle = simNode === hoveredNode ? primaryColor : mutedColor
                    ctx.fill()
                    ctx.globalAlpha = 1

                    if (globalScale > 1.5 && isHighlighted) {
                        ctx.globalAlpha = opacity
                        ctx.font = `${fontSize}px Sans-Serif`
                        ctx.textAlign = 'center'
                        ctx.textBaseline = 'middle'
                        ctx.fillStyle = mutedColor
                        ctx.fillText(simNode.title, simNode.x, simNode.y + nodeSize + fontSize)
                        ctx.globalAlpha = 1
                    }
                }}
                linkCanvasObject={(link, ctx) => {
                    const { source: s, target: t } = link as unknown as SimLink
                    if (!s || !t) return

                    const sourceId = s.id ?? String(link.source)
                    const targetId = t.id ?? String(link.target)
                    const isHighlighted = !hoveredNode || highlightLinks.has(`${sourceId}-${targetId}`)

                    ctx.save()
                    ctx.lineWidth = isHighlighted ? 1.0 : 0.6
                    ctx.strokeStyle = borderColor
                    ctx.globalAlpha = isHighlighted ? 0.45 : 0.12
                    ctx.beginPath()
                    ctx.moveTo(s.x, s.y)
                    ctx.lineTo(t.x, t.y)
                    ctx.stroke()
                    ctx.restore()
                }}
                linkCanvasObjectMode={() => 'replace'}
                onNodeClick={(node) => onNodeClick(node as GraphNode)}
                onNodeHover={(node) => handleNodeHover(node as GraphNode | null)}
                cooldownTicks={100}
                onEngineStop={handleFit}
            />
        </div>
    )
}
