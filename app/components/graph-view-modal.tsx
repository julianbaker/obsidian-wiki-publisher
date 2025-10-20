'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading graph...</div>
        </div>
    ),
})

interface GraphNode {
    id: string
    title: string
    folder: string
}

interface GraphLink {
    source: string
    target: string
}

interface GraphData {
    nodes: GraphNode[]
    links: GraphLink[]
}

interface GraphViewModalProps {
    isOpen: boolean
    onClose: () => void
}

export function GraphViewModal({ isOpen, onClose }: GraphViewModalProps) {
    const router = useRouter()
    const [graphData, setGraphData] = useState<GraphData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
    const [highlightNodes, setHighlightNodes] = useState(new Set<string>())
    const [highlightLinks, setHighlightLinks] = useState(new Set<string>())
    const graphRef = useRef<any>()

    useEffect(() => {
        if (isOpen && !graphData) {
            fetch('/api/graph')
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch graph data')
                    return res.json()
                })
                .then((data) => {
                    setGraphData(data)
                    setLoading(false)
                })
                .catch((err) => {
                    setError(err.message)
                    setLoading(false)
                })
        }
    }, [isOpen, graphData])

    const handleNodeClick = useCallback(
        (node: GraphNode) => {
            onClose()
            router.push(`/${node.id}`)
        },
        [router, onClose]
    )

    const handleNodeHover = useCallback((node: GraphNode | null) => {
        setHoveredNode(node)

        if (!node) {
            setHighlightNodes(new Set())
            setHighlightLinks(new Set())
            return
        }

        // Find all directly connected nodes and links
        const connectedNodes = new Set<string>([node.id])
        const connectedLinks = new Set<string>()

        if (graphData) {
            graphData.links.forEach(link => {
                const source = typeof link.source === 'object' ? (link.source as any).id : link.source
                const target = typeof link.target === 'object' ? (link.target as any).id : link.target

                if (source === node.id) {
                    connectedNodes.add(target)
                    connectedLinks.add(`${source}-${target}`)
                }
                if (target === node.id) {
                    connectedNodes.add(source)
                    connectedLinks.add(`${source}-${target}`)
                }
            })
        }

        setHighlightNodes(connectedNodes)
        setHighlightLinks(connectedLinks)
    }, [graphData])

    const handleZoomIn = () => {
        if (graphRef.current) {
            graphRef.current.zoom(graphRef.current.zoom() * 1.5, 400)
        }
    }

    const handleZoomOut = () => {
        if (graphRef.current) {
            graphRef.current.zoom(graphRef.current.zoom() / 1.5, 400)
        }
    }

    const handleCenter = () => {
        if (graphRef.current) {
            graphRef.current.zoomToFit(400, 50)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="absolute inset-0 md:inset-8 md:rounded-lg bg-background border-0 md:border border-border shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border">
                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="text-lg md:text-xl font-semibold">Graph View</div>
                        {graphData && (
                            <div className="hidden sm:block text-sm text-muted-foreground">
                                {graphData.nodes.length} pages, {graphData.links.length} connections
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-accent transition-colors touch-manipulation"
                        title="Close"
                        aria-label="Close graph view"
                    >
                        <X size={24} className="md:w-5 md:h-5" />
                    </button>
                </div>

                {/* Controls */}
                <div className="absolute bottom-4 right-4 md:top-20 md:bottom-auto md:right-6 z-10 flex flex-row md:flex-col gap-2">
                    <button
                        onClick={handleZoomIn}
                        className="p-3 md:p-3 bg-card border border-border rounded-lg hover:bg-accent active:bg-muted transition-colors shadow-lg touch-manipulation"
                        title="Zoom In"
                        aria-label="Zoom in"
                    >
                        <ZoomIn size={20} />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-3 md:p-3 bg-card border border-border rounded-lg hover:bg-accent active:bg-muted transition-colors shadow-lg touch-manipulation"
                        title="Zoom Out"
                        aria-label="Zoom out"
                    >
                        <ZoomOut size={20} />
                    </button>
                    <button
                        onClick={handleCenter}
                        className="p-3 md:p-3 bg-card border border-border rounded-lg hover:bg-accent active:bg-muted transition-colors shadow-lg touch-manipulation"
                        title="Fit to Screen"
                        aria-label="Fit graph to screen"
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>

                {/* Node Info Card */}
                {hoveredNode && (
                    <div className="absolute top-16 left-4 right-4 md:top-20 md:left-6 md:right-auto z-10 p-3 md:p-4 bg-card border border-border rounded-lg shadow-lg md:max-w-sm">
                        <div className="font-semibold text-base md:text-lg mb-1 truncate">{hoveredNode.title}</div>
                        <div className="text-xs md:text-sm text-muted-foreground truncate">
                            {hoveredNode.folder || 'Root'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 md:mt-2">
                            Tap to view page
                        </div>
                    </div>
                )}

                {/* Graph */}
                <div className="flex-1 relative">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-lg">Loading graph...</div>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="text-lg text-destructive mb-4">Error: {error}</div>
                            </div>
                        </div>
                    )}
                    {!loading && !error && graphData && (
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            nodeLabel={(node: any) => node.title}
                            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                                const label = node.title
                                const fontSize = 12 / globalScale
                                const nodeSize = 4

                                // Get colors from CSS variables
                                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()
                                const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--muted-foreground').trim()

                                // Determine if node should be dimmed
                                const isHighlighted = !hoveredNode || highlightNodes.has(node.id)
                                const opacity = isHighlighted ? 1 : 0.15

                                // Draw node - single color with highlight state
                                ctx.beginPath()
                                ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false)
                                ctx.globalAlpha = opacity
                                ctx.fillStyle = node === hoveredNode ? primaryColor : mutedColor
                                ctx.fill()
                                ctx.globalAlpha = 1

                                // Draw label if zoomed in enough
                                if (globalScale > 1.5 && isHighlighted) {
                                    ctx.globalAlpha = opacity
                                    ctx.font = `${fontSize}px Sans-Serif`
                                    ctx.textAlign = 'center'
                                    ctx.textBaseline = 'middle'
                                    ctx.fillStyle = mutedColor
                                    ctx.fillText(label, node.x, node.y + nodeSize + fontSize)
                                    ctx.globalAlpha = 1
                                }
                            }}
                            linkColor={(link: any) => {
                                const source = typeof link.source === 'object' ? link.source.id : link.source
                                const target = typeof link.target === 'object' ? link.target.id : link.target
                                const linkId = `${source}-${target}`

                                const isHighlighted = !hoveredNode || highlightLinks.has(linkId)

                                const borderVal = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
                                const bgVal = getComputedStyle(document.documentElement).getPropertyValue('--background').trim()

                                const temp1 = document.createElement('div')
                                temp1.style.color = borderVal
                                document.body.appendChild(temp1)
                                const borderRgb = getComputedStyle(temp1).color
                                document.body.removeChild(temp1)

                                const temp2 = document.createElement('div')
                                temp2.style.color = bgVal
                                document.body.appendChild(temp2)
                                const bgRgb = getComputedStyle(temp2).color
                                document.body.removeChild(temp2)

                                const parse = (s: string) => {
                                    const m = s.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
                                    return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : [0, 0, 0]
                                }
                                const [br, bg, bb] = parse(borderRgb)
                                const [ar, ag, ab] = parse(bgRgb)
                                const mix = (t: number) => `rgb(${Math.round(ar * (1 - t) + br * t)}, ${Math.round(ag * (1 - t) + bg * t)}, ${Math.round(ab * (1 - t) + bb * t)})`

                                // Increase contrast: dim closer to background
                                return isHighlighted ? borderRgb : mix(0.08)
                            }}
                            // no linkOpacity: alpha is encoded per-link above
                            linkWidth={(link: any) => {
                                const source = typeof link.source === 'object' ? link.source.id : link.source
                                const target = typeof link.target === 'object' ? link.target.id : link.target
                                const linkId = `${source}-${target}`
                                const isHighlighted = !hoveredNode || highlightLinks.has(linkId)
                                return isHighlighted ? 1.6 : 0.9
                            }}
                            linkCanvasObject={(link: any, ctx: CanvasRenderingContext2D) => {
                                const s = link.source as any
                                const t = link.target as any
                                if (!s || !t) return

                                const sourceId = typeof link.source === 'object' ? link.source.id : link.source
                                const targetId = typeof link.target === 'object' ? link.target.id : link.target
                                const linkId = `${sourceId}-${targetId}`
                                const isHighlighted = !hoveredNode || highlightLinks.has(linkId)
                                const alpha = isHighlighted ? 0.45 : 0.12
                                const width = isHighlighted ? 1.0 : 0.6

                                const borderVal = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
                                const tmp = document.createElement('div')
                                tmp.style.color = borderVal
                                document.body.appendChild(tmp)
                                const rgb = getComputedStyle(tmp).color
                                document.body.removeChild(tmp)
                                const m = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
                                let stroke = rgb
                                if (m) {
                                    const [_, r, g, b] = m
                                    stroke = `rgb(${r}, ${g}, ${b})`
                                }

                                ctx.save()
                                ctx.lineWidth = width
                                ctx.strokeStyle = stroke
                                ctx.globalAlpha = alpha
                                ctx.beginPath()
                                ctx.moveTo(s.x, s.y)
                                ctx.lineTo(t.x, t.y)
                                ctx.stroke()
                                ctx.restore()
                            }}
                            linkCanvasObjectMode={() => 'replace'}
                            onNodeClick={handleNodeClick}
                            onNodeHover={handleNodeHover}
                            cooldownTicks={100}
                            onEngineStop={() => {
                                if (graphRef.current) {
                                    graphRef.current.zoomToFit(400, 50)
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

