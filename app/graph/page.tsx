'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen">
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

export default function GraphView() {
    const router = useRouter()
    const [graphData, setGraphData] = useState<GraphData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
    const [highlightNodes, setHighlightNodes] = useState(new Set<string>())
    const [highlightLinks, setHighlightLinks] = useState(new Set<string>())
    const graphRef = useRef<any>()

    useEffect(() => {
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
    }, [])

    const handleNodeClick = useCallback(
        (node: GraphNode) => {
            router.push(`/${node.id}`)
        },
        [router]
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading graph view...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-destructive mb-4">Error: {error}</div>
                    <Link href="/" className="text-primary hover:underline">
                        Back Home
                    </Link>
                </div>
            </div>
        )
    }

    if (!graphData || graphData.nodes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg mb-4">No graph data available</div>
                    <Link href="/" className="text-primary hover:underline">
                        Back Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 bg-background">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Home size={20} />
                            <span>Back Home</span>
                        </Link>
                        <div className="text-xl font-semibold">Graph View</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {graphData.nodes.length} pages, {graphData.links.length} connections
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-20 right-6 z-10 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors shadow-sm"
                    title="Zoom In"
                >
                    <ZoomIn size={20} />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors shadow-sm"
                    title="Zoom Out"
                >
                    <ZoomOut size={20} />
                </button>
                <button
                    onClick={handleCenter}
                    className="p-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors shadow-sm"
                    title="Fit to Screen"
                >
                    <Maximize2 size={20} />
                </button>
            </div>

            {/* Node Info Card */}
            {hoveredNode && (
                <div className="absolute top-20 left-6 z-10 p-4 bg-card border border-border rounded-lg shadow-lg max-w-sm">
                    <div className="font-semibold text-lg mb-1">{hoveredNode.title}</div>
                    <div className="text-sm text-muted-foreground">
                        {hoveredNode.folder || 'Root'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                        Click to view page
                    </div>
                </div>
            )}

            {/* Graph */}
            <div className="w-full h-full pt-16">
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
                        const alpha = isHighlighted ? 0.45 : 0.12

                        const borderVal = getComputedStyle(document.documentElement).getPropertyValue('--border').trim()
                        const temp = document.createElement('div')
                        temp.style.color = borderVal
                        document.body.appendChild(temp)
                        const rgb = getComputedStyle(temp).color
                        document.body.removeChild(temp)

                        const m = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
                        if (m) {
                            const [_, r, g, b] = m
                            return `rgba(${r}, ${g}, ${b}, ${alpha})`
                        }
                        return rgb
                    }}
                    // linkOpacity not used; alpha encoded in color string
                    linkWidth={(link: any) => {
                        const source = typeof link.source === 'object' ? link.source.id : link.source
                        const target = typeof link.target === 'object' ? link.target.id : link.target
                        const linkId = `${source}-${target}`
                        const isHighlighted = !hoveredNode || highlightLinks.has(linkId)
                        return isHighlighted ? 1.6 : 0.9
                    }}
                    onNodeClick={handleNodeClick}
                    onNodeHover={handleNodeHover}
                    cooldownTicks={100}
                    onEngineStop={() => {
                        if (graphRef.current) {
                            graphRef.current.zoomToFit(400, 50)
                        }
                    }}
                />
            </div>
        </div>
    )
}


