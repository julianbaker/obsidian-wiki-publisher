'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { GraphCanvas, type GraphData, type GraphNode } from 'app/components/graph-canvas'

export default function GraphView() {
    const router = useRouter()
    const [graphData, setGraphData] = useState<GraphData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/graph')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch graph data')
                return res.json() as Promise<GraphData>
            })
            .then((data) => { setGraphData(data); setLoading(false) })
            .catch((err: Error) => { setError(err.message); setLoading(false) })
    }, [])

    const handleNodeClick = (node: GraphNode) => router.push(`/${node.id}`)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading graph view…</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg text-destructive mb-4">Error: {error}</div>
                    <Link href="/" className="text-primary hover:underline">Back Home</Link>
                </div>
            </div>
        )
    }

    if (!graphData || graphData.nodes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="text-lg mb-4">No graph data available</div>
                    <Link href="/" className="text-primary hover:underline">Back Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            <div className="flex-shrink-0 bg-background/90 backdrop-blur-sm border-b border-border">
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

            <div className="flex-1 relative min-h-0">
                <GraphCanvas graphData={graphData} onNodeClick={handleNodeClick} />
            </div>
        </div>
    )
}
