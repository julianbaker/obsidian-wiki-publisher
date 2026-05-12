import Link from 'next/link'
import Image, { type ImageProps } from 'next/image'
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

interface TableData {
  headers: string[]
  rows: string[][]
}

function Table({ data }: { data: TableData }) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  const rows = data.rows.map((row, index) => (
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

interface CustomLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
}

function CustomLink({ href = '', children, ...rest }: CustomLinkProps) {
  if (href.startsWith('/')) {
    const routePath = href.replace(/^\/+|\/+$/g, '')
    const allPosts = getLorePosts()
    const existingRoutePaths = new Set(allPosts.map((post) => post.routePath))
    const isStub = routePath !== '' && !existingRoutePaths.has(routePath)

    if (isStub) {
      return <a href={href} className="stub-link" {...rest}>{children}</a>
    }

    return <Link href={href} {...rest}>{children}</Link>
  }

  if (href.startsWith('#')) {
    return <a href={href} {...rest}>{children}</a>
  }

  return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>
}

function RoundedImage(props: ImageProps) {
  return <Image {...props} alt={props.alt} className="rounded-lg" />
}

function Code({ children, ...props }: { children: string } & React.HTMLAttributes<HTMLElement>) {
  const codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

/**
 * Converts Obsidian WikiLinks to standard markdown links.
 * Handles:
 * - [[Page Name]] and [[Page Name|Display Text]] for internal links
 * - ![[image.png]] and ![[image.png|alt text]] for embedded images
 * - [[#Heading]] for in-page anchors
 * Stub detection is delegated to CustomLink.
 */
function convertWikiLinks(content: string): string {
  const allPosts = getLorePosts()

  // Image embeds first: ![[image.png]] or ![[image.png|alt text]]
  content = content.replace(/!\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (_match, imagePath: string, _pipe, altText?: string) => {
    const alt = altText ?? imagePath.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'image'
    return `![${alt.trim()}](${imagePath.trim()})`
  })

  // Regular WikiLinks: [[Page Name]] or [[Page Name|Display Text]]
  content = content.replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (_match, pageName: string, _pipe, displayText?: string) => {
    const rawTarget = pageName.trim()
    const linkText = (displayText ?? pageName).trim()

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
  if (React.isValidElement(node)) return extractText((node.props as { children?: React.ReactNode }).children)
  return ''
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
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

const components = {
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

interface CustomMDXProps {
  source: string
  components?: Record<string, React.ComponentType>
}

export function CustomMDX({ source, components: propComponents }: CustomMDXProps) {
  // Process content in order:
  // 1. Dataview queries (replace code blocks with lists/tables)
  // 2. Timeline blocks (replace code blocks with HTML timelines)
  // 3. WikiLinks (convert [[links]] to markdown links)
  let processedSource = source
  processedSource = processDataviewBlocks(processedSource)
  processedSource = processTimelineBlocks(processedSource)
  processedSource = convertWikiLinks(processedSource)

  return (
    <StubLinkHandler>
      <MDXRemote
        source={processedSource}
        components={{ ...components, ...(propComponents ?? {}) }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </StubLinkHandler>
  )
}
