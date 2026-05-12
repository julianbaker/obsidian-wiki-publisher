/**
 * Process Obsidian Timeline code blocks at build time
 * Supports the standard Obsidian Timeline plugin syntax
 */

import {
    getFallbackRoutePath,
    getLorePosts,
    getRouteHref,
    resolveWikiLinkTarget
} from './utils'
import { slugify } from 'lib/utils'

export interface TimelineEvent {
    date: string
    title: string
    description: string
}

/**
 * Parse timeline code block content
 * Format:
 * + Date/Time
 * + Title
 * + Description
 */
export function parseTimelineBlock(content: string): TimelineEvent[] {
    // Ignore blank lines so authoring style can include spacing between events.
    const lines = content
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
    const events: TimelineEvent[] = []

    // Process lines in groups of 3
    for (let i = 0; i < lines.length; i += 3) {
        const dateLine = lines[i]
        const titleLine = lines[i + 1]
        const descLine = lines[i + 2]

        // Each line should start with +
        if (dateLine?.startsWith('+') && titleLine?.startsWith('+') && descLine?.startsWith('+')) {
            events.push({
                date: dateLine.substring(1).trim(),
                title: titleLine.substring(1).trim(),
                description: descLine.substring(1).trim(),
            })
        }
    }

    return events
}

/**
 * Convert WikiLinks in text to HTML links
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

function convertWikiLinksToHTML(text: string, allPosts = getLorePosts()): string {
    const wikiLinkRegex = /\[\[([^\]|]+)(\|([^\]]+))?\]\]/g
    let output = ''
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = wikiLinkRegex.exec(text)) !== null) {
        output += escapeHtml(text.slice(lastIndex, match.index))

        const rawTarget = match[1].trim()
        const linkText = escapeHtml((match[3] || match[1]).trim())

        if (rawTarget.startsWith('#')) {
            const anchorSlug = slugify(rawTarget.substring(1))
            output += `<a href="#${anchorSlug}">${linkText}</a>`
            lastIndex = wikiLinkRegex.lastIndex
            continue
        }

        const resolved = resolveWikiLinkTarget(rawTarget, allPosts)
        const routePath = resolved
            ? resolved.routePath
            : getFallbackRoutePath(rawTarget)
        const href = getRouteHref(routePath)
        const isStub = routePath !== '' && !resolved

        output += `<a href="${href}"${isStub ? ' class="stub-link"' : ''}>${linkText}</a>`
        lastIndex = wikiLinkRegex.lastIndex
    }

    output += escapeHtml(text.slice(lastIndex))
    return output
}

/**
 * Convert timeline events to HTML for rendering
 * This creates a simple HTML timeline that can be styled with CSS
 */
export function renderTimelineHTML(events: TimelineEvent[]): string {
    if (events.length === 0) {
        return '<div class="timeline-empty">No timeline events found.</div>'
    }

    let html = '<div class="timeline-container">\n'
    html += '  <div class="timeline-line"></div>\n'

    const allPosts = getLorePosts()

    events.forEach((event) => {
        // Convert WikiLinks in title and description (including [[#anchor]] links)
        const titleHTML = convertWikiLinksToHTML(event.title, allPosts)
        const descriptionHTML = convertWikiLinksToHTML(event.description, allPosts)
        const safeDate = escapeHtml(event.date)

        html += `  <div class="timeline-event">\n`
        html += `    <div class="timeline-marker"></div>\n`
        html += `    <div class="timeline-content">\n`
        html += `      <div class="timeline-date">${safeDate}</div>\n`
        html += `      <div class="timeline-title">${titleHTML}</div>\n`
        html += `      <div class="timeline-description">${descriptionHTML}</div>\n`
        html += `    </div>\n`
        html += `  </div>\n`
    })

    html += '</div>\n'
    return html
}

/**
 * Process all timeline code blocks in markdown content
 */
export function processTimelineBlocks(content: string): string {
    // Match timeline code blocks: ```timeline
    const timelineRegex = /```timeline\s*\n([\s\S]*?)\n```/g

    return content.replace(timelineRegex, (match, blockContent) => {
        try {
            const events = parseTimelineBlock(blockContent)
            const html = renderTimelineHTML(events)
            return html
        } catch (error) {
            console.error('Timeline parsing error:', error)
            return '<div class="timeline-error">Error processing timeline.</div>'
        }
    })
}
