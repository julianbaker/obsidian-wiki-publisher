export type SiteConfig = {
    siteName: string
    tagline?: string
    description: string
    baseUrl: string
    author?: string
}

export const siteConfig: SiteConfig = {
    siteName: 'Bob Loblore Lore Blog',
    tagline: 'Obsidian-powered wiki publishing',
    description: 'A simple, open-source Obsidian publishing tool with WikiLinks, backlinks, and Dataview-like queries.',
    // Change this to your production domain after deploying
    baseUrl: 'http://localhost:3000',
    author: 'Bob Loblore',
}

export const baseUrl = siteConfig.baseUrl
export const siteName = siteConfig.siteName

