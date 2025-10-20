/**
 * Process Obsidian Timeline code blocks at build time
 * Supports the standard Obsidian Timeline plugin syntax
 */

import { getLorePosts } from './utils'
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
    const lines = content.trim().split('\n').map(line => line.trim())
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
function convertWikiLinksToHTML(text: string): string {
    const allPosts = getLorePosts()
    const existingSlugs = new Set(allPosts.map(post => post.slug))

    // Convert [[#anchor]] or [[#anchor|Display Text]] to anchor links
    text = text.replace(/\[\[#([^\]|]+)(\|([^\]]+))?\]\]/g, (match, anchor, _, displayText) => {
        const linkText = displayText || anchor
        const anchorSlug = slugify(anchor.trim())
        return `<a href="#${anchorSlug}">${linkText.trim()}</a>`
    })

    // Convert [[Page Name]] or [[Page Name|Display Text]] to HTML links
    return text.replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (match, pageName, _, displayText) => {
        const linkText = displayText || pageName
        const pageNameOnly = pageName.includes('/')
            ? pageName.split('/').pop()?.trim() || pageName
            : pageName.trim()

        const slug = slugify(pageNameOnly)
        const isStub = !existingSlugs.has(slug)
        const className = isStub ? ' class="stub-link"' : ''

        return `<a href="/${slug}"${className}>${linkText.trim()}</a>`
    })
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

    events.forEach((event) => {
        // Convert WikiLinks in title and description (including [[#anchor]] links)
        const titleHTML = convertWikiLinksToHTML(event.title)
        const descriptionHTML = convertWikiLinksToHTML(event.description)

        html += `  <div class="timeline-event">\n`
        html += `    <div class="timeline-marker"></div>\n`
        html += `    <div class="timeline-content">\n`
        html += `      <div class="timeline-date">${event.date}</div>\n`
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

