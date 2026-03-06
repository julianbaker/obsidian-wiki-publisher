export type SiteConfig = {
    siteName: string
    tagline?: string
    description: string
    baseUrl: string
    author?: string
}

function normalizeBaseUrl(value?: string): string | null {
    if (!value) return null
    const trimmed = value.trim()
    if (!trimmed) return null

    const withProtocol = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`

    try {
        const parsed = new URL(withProtocol)
        return parsed.origin
    } catch {
        return null
    }
}

const envBaseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL)
const vercelBaseUrl = normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)

// Safe fallback:
// - development: localhost for local work
// - production: example.com to avoid shipping localhost canonicals
const fallbackBaseUrl = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://example.com'

const resolvedBaseUrl = envBaseUrl ?? vercelBaseUrl ?? fallbackBaseUrl

if (process.env.NODE_ENV === 'production' && !envBaseUrl && !vercelBaseUrl) {
    console.warn(
        'NEXT_PUBLIC_SITE_URL is not set; using https://example.com as baseUrl fallback. Set NEXT_PUBLIC_SITE_URL in production.'
    )
}

export const siteConfig: SiteConfig = {
    siteName: 'Bob Loblore Lore Blog',
    tagline: 'Obsidian-powered wiki publishing',
    description: 'A simple, open-source Obsidian publishing tool with WikiLinks, backlinks, and Dataview-like queries.',
    baseUrl: resolvedBaseUrl,
    author: 'Bob Loblore',
}

export const baseUrl = siteConfig.baseUrl
export const siteName = siteConfig.siteName
