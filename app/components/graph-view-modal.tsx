'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { GraphCanvas, type GraphData, type GraphNode } from './graph-canvas'

interface GraphViewModalProps {
    isOpen: boolean
    onClose: () => void
}

export function GraphViewModal({ isOpen, onClose }: GraphViewModalProps) {
    const router = useRouter()
    const [graphData, setGraphData] = useState<GraphData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch once per modal lifecycle; skip if already loaded
    useEffect(() => {
        if (!isOpen || graphData) return
        fetch('/api/graph')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch graph data')
                return res.json() as Promise<GraphData>
            })
            .then((data) => { setGraphData(data); setLoading(false) })
            .catch((err: Error) => { setError(err.message); setLoading(false) })
    }, [isOpen, graphData])

    const handleNodeClick = (node: GraphNode) => {
        onClose()
        router.push(`/${node.id}`)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="absolute inset-0 md:inset-8 md:rounded-lg bg-background border-0 md:border border-border shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border flex-shrink-0">
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

                <div className="flex-1 relative min-h-0">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-lg">Loading graph…</div>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-lg text-destructive">Error: {error}</div>
                        </div>
                    )}
                    {!loading && !error && graphData && (
                        <GraphCanvas graphData={graphData} onNodeClick={handleNodeClick} />
                    )}
                </div>
            </div>
        </div>
    )
}
