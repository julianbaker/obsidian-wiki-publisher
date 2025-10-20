import { buildLinkGraph } from 'app/content/utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const graph = buildLinkGraph()
    return NextResponse.json(graph)
  } catch (error) {
    console.error('Error building graph:', error)
    return NextResponse.json(
      { error: 'Failed to build graph' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'

