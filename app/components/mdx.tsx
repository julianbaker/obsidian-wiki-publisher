import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { processDataviewBlocks } from 'app/content/dataview'
import { processTimelineBlocks } from 'app/content/timeline'
import remarkGfm from 'remark-gfm'
import {
  getLorePosts,
  getFallbackRoutePath,
  getRouteHref,
  resolveWikiLinkTarget,
} from 'app/content/utils'
import { slugify } from 'lib/utils'
import { StubLinkHandler } from './stub-link-handler'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  let href = props.href ?? ''

  if (href.startsWith('/')) {
    // Check if this is a stub link
    const routePath = href.replace(/^\/+|\/+$/g, '')
    const allPosts = getLorePosts()
    const existingRoutePaths = new Set(allPosts.map((post) => post.routePath))
    const isStub = routePath !== '' && !existingRoutePaths.has(routePath)

    if (isStub) {
      // Return anchor with stub-link class for client-side handling
      return <a href={href} className="stub-link" {...props} />
    }

    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
  let codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

/**
 * Converts Obsidian WikiLinks to standard markdown links
 * Handles:
 * - [[Page Name]] and [[Page Name|Display Text]] for links
 * - ![[image.png]] for images
 * - ![[image.png|alt text]] for images with alt text
 * - All links are converted to standard markdown format
 * - Stub detection is handled in CustomLink component
 */
function convertWikiLinks(content: string): string {
  const allPosts = getLorePosts()

  // First, handle image WikiLinks: ![[image.png]] or ![[image.png|alt text]]
  content = content.replace(/!\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (match, imagePath, _, altText) => {
    const alt = altText || imagePath.split('/').pop()?.replace(/\.[^.]+$/, '') || 'image'
    // Assume images are in a public or relative path
    return `![${alt.trim()}](${imagePath.trim()})`
  })

  // Then, handle regular WikiLinks: [[Page Name]] or [[Page Name|Display Text]]
  content = content.replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (match, pageName, _, displayText) => {
    // Use display text if provided, otherwise use page name
    const rawTarget = pageName.trim()
    const linkText = (displayText || pageName).trim()

    if (rawTarget.startsWith('#')) {
      const anchor = slugify(rawTarget.substring(1))
      return `[${linkText}](#${anchor})`
    }

    const resolvedPost = resolveWikiLinkTarget(rawTarget, allPosts)
    const routePath = resolvedPost
      ? resolvedPost.routePath
      : getFallbackRoutePath(rawTarget)

    return `[${linkText}](${getRouteHref(routePath)})`
  })

  return content
}

// Extract plain text from MDX heading children so slug generation is stable
function extractText(node: React.ReactNode): string {
  if (node == null) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (React.isValidElement(node)) return extractText((node as any).props?.children)
  return ''
}

function createHeading(level) {
  const Heading = ({ children }) => {
    const text = extractText(children)
    const slug = slugify(text)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
}

export function CustomMDX(props) {
  // Process content in order:
  // 1. Dataview queries (replace code blocks with lists/tables)
  // 2. Timeline blocks (replace code blocks with HTML timelines)
  // 3. WikiLinks (convert [[links]] to markdown links)
  let processedSource = props.source

  if (typeof processedSource === 'string') {
    processedSource = processDataviewBlocks(processedSource)
    processedSource = processTimelineBlocks(processedSource)
    processedSource = convertWikiLinks(processedSource)
  }

  return (
    <StubLinkHandler>
      <MDXRemote
        {...props}
        source={processedSource}
        components={{ ...components, ...(props.components || {}) }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </StubLinkHandler>
  )
}
