import fs from 'fs'
import path from 'path'
import { slugify } from 'lib/utils'

export type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  category?: string
  published?: boolean
}

export type LorePost = {
  metadata: Metadata
  slug: string
  routePath: string
  pathSegments: string[]
  content: string
  folderPath: string
  relativePath: string
}

type FolderStructureNode = {
  name: string
  posts: LorePost[]
  subfolders: Record<string, FolderStructureNode>
}

type WikiLinkIndex = {
  byRoutePath: Map<string, LorePost>
  bySlug: Map<string, LorePost[]>
}

/**
 * Extracts title from the first H1 heading in markdown content
 */
function extractTitleFromContent(content: string): string {
  const h1Match = content.match(/^#\s+(.+)$/m)
  return h1Match ? h1Match[1].trim() : 'Untitled'
}

/**
 * Extracts a summary from the first paragraph after the title
 */
function extractSummary(content: string): string {
  // Remove the first H1
  const withoutTitle = content.replace(/^#\s+.+$/m, '').trim()
  // Get first paragraph (non-empty line that's not a heading)
  const paragraphMatch = withoutTitle.match(/^[^#\-\s].+$/m)
  return paragraphMatch ? paragraphMatch[0].trim().substring(0, 200) : ''
}

function parseFrontmatter(fileContent: string, filePath?: string) {
  // Only treat a top-of-file block as frontmatter; ignore '---' used as horizontal rules in content
  let frontmatterRegex = /^---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let metadata: Partial<Metadata> = {}
  let content = fileContent

  // If frontmatter exists, parse it
  if (match) {
    let frontMatterBlock = match[1]
    content = fileContent.replace(frontmatterRegex, '').trim()
    let frontMatterLines = frontMatterBlock.trim().split('\n')

    frontMatterLines.forEach((line) => {
      let [key, ...valueArr] = line.split(': ')
      let value = valueArr.join(': ').trim()
      value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes

      // Handle boolean values
      if (key.trim() === 'published') {
        metadata.published = value === 'true'
      } else {
        // Handle other metadata fields
        const trimmedKey = key.trim() as keyof Metadata
        if (trimmedKey === 'title') {
          metadata.title = value
        } else if (trimmedKey === 'publishedAt') {
          metadata.publishedAt = value
        } else if (trimmedKey === 'summary') {
          metadata.summary = value
        } else if (trimmedKey === 'image') {
          metadata.image = value
        } else if (trimmedKey === 'category') {
          metadata.category = value
        }
      }
    })
  }

  // Fill in missing metadata from content
  if (!metadata.title) {
    metadata.title = extractTitleFromContent(content)
  }

  if (!metadata.summary) {
    metadata.summary = extractSummary(content)
  }

  if (!metadata.publishedAt) {
    // Use file modification date if available, otherwise current date
    if (filePath && fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      metadata.publishedAt = stats.mtime.toISOString().split('T')[0]
    } else {
      metadata.publishedAt = new Date().toISOString().split('T')[0]
    }
  }

  // Default to published if not specified
  if (metadata.published === undefined) {
    metadata.published = true
  }

  return { metadata: metadata as Metadata, content }
}

/**
 * Recursively get all markdown files in a directory with their relative paths
 */
function getMarkdownFilesRecursive(dir: string, baseDir: string = dir): string[] {
  let results: string[] = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip .obsidian and other hidden directories
      if (!item.startsWith('.')) {
        results = results.concat(getMarkdownFilesRecursive(fullPath, baseDir))
      }
    } else {
      const ext = path.extname(item)
      if (ext === '.mdx' || ext === '.md') {
        // Store relative path from base directory
        const relativePath = path.relative(baseDir, fullPath)
        results.push(relativePath)
      }
    }
  }

  return results
}

function readMarkdownFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent, filePath)
}

/**
 * Extracts folder path as a category (e.g., "1. Core" or "2. Civilizations/Americas")
 */
function extractFolderCategory(relativePath: string): string | undefined {
  const dirPath = path.dirname(relativePath)
  if (dirPath === '.') return undefined
  return dirPath
}

function normalizeRouteSegments(segments: string[]) {
  const normalized = segments
    .map((segment) => slugify(segment.trim()))
    .filter(Boolean)

  if (normalized.length === 1 && normalized[0] === 'index') {
    return [] as string[]
  }

  if (
    normalized.length > 1 &&
    normalized[normalized.length - 1] === normalized[normalized.length - 2]
  ) {
    normalized.pop()
  }

  return normalized
}

function toRoutePathFromRelativePath(relativePath: string) {
  const withoutExt = relativePath.slice(0, -path.extname(relativePath).length)
  const rawSegments = withoutExt.split(path.sep)
  const pathSegments = normalizeRouteSegments(rawSegments)
  return {
    pathSegments,
    routePath: pathSegments.join('/'),
  }
}

function buildWikiLinkIndex(posts: LorePost[]): WikiLinkIndex {
  const byRoutePath = new Map<string, LorePost>()
  const bySlug = new Map<string, LorePost[]>()

  posts.forEach((post) => {
    byRoutePath.set(post.routePath, post)
    const existing = bySlug.get(post.slug) ?? []
    existing.push(post)
    bySlug.set(post.slug, existing)
  })

  return { byRoutePath, bySlug }
}

function getCanonicalWikiLinkTarget(rawTarget: string) {
  const withoutAnchor = rawTarget.split('#')[0].trim()
  if (!withoutAnchor || withoutAnchor.startsWith('#')) return ''

  const normalized = normalizeRouteSegments(withoutAnchor.split('/'))
  return normalized.join('/')
}

function resolveWikiLinkTargetWithIndex(
  rawTarget: string,
  index: WikiLinkIndex
): LorePost | null {
  const canonicalTarget = getCanonicalWikiLinkTarget(rawTarget)
  if (!canonicalTarget && slugify(rawTarget.trim()) !== 'index') {
    return null
  }

  const directMatch = index.byRoutePath.get(canonicalTarget)
  if (directMatch) return directMatch

  // For bare wikilinks (e.g. [[My Page]]) only resolve unambiguously.
  if (!rawTarget.includes('/')) {
    const slugMatches = index.bySlug.get(slugify(rawTarget)) ?? []
    if (slugMatches.length === 1) {
      return slugMatches[0]
    }
  }

  return null
}

function getMarkdownData(dir: string): LorePost[] {
  let markdownFiles = getMarkdownFilesRecursive(dir)
  const usedRoutePaths = new Map<string, string>()

  return markdownFiles.map((relativePath) => {
    const fullPath = path.join(dir, relativePath)
    let { metadata, content } = readMarkdownFile(fullPath)
    const fileName = path.basename(relativePath, path.extname(relativePath))
    const slug = slugify(fileName)
    const { pathSegments, routePath } = toRoutePathFromRelativePath(relativePath)

    const existingRouteOwner = usedRoutePaths.get(routePath)
    if (existingRouteOwner) {
      throw new Error(
        `Duplicate route path "${routePath}" generated for "${relativePath}" and "${existingRouteOwner}".`
      )
    }
    usedRoutePaths.set(routePath, relativePath)

    // Extract folder category if not already set
    if (!metadata.category) {
      metadata.category = extractFolderCategory(relativePath)
    }

    return {
      metadata,
      slug,
      routePath,
      pathSegments,
      content,
      folderPath: path.dirname(relativePath), // Keep original folder structure
      relativePath,
    }
  })
}

export function getLorePosts() {
  return getMarkdownData(path.join(process.cwd(), 'app', 'content', 'posts'))
    .filter((post) => post.metadata.published === true)
}

export function getAllPosts() {
  return getMarkdownData(path.join(process.cwd(), 'app', 'content', 'posts'))
}

export function getLorePostsByCategory(category: string) {
  return getLorePosts().filter((post) => post.metadata.category === category)
}

export function getAllCategories() {
  const posts = getLorePosts()
  const categories = posts
    .map((post) => post.metadata.category)
    .filter((category): category is string => category !== undefined)
  return Array.from(new Set(categories)).sort()
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

/**
 * Get all unique top-level folders from posts
 */
export function getAllFolders() {
  const posts = getLorePosts()
  const folders = posts
    .map((post) => {
      const folderPath = post.folderPath || '.'
      // Get just the top-level folder (e.g., "1. Core" from "1. Core/subfolder")
      const topLevel = folderPath.split(path.sep)[0]
      return topLevel !== '.' ? topLevel : null
    })
    .filter((folder): folder is string => folder !== null)

  return Array.from(new Set(folders)).sort()
}

/**
 * Get posts organized by their folder structure
 */
export function getPostsByFolder() {
  const posts = getLorePosts()
  const grouped: Record<string, LorePost[]> = {}

  posts.forEach((post) => {
    const folder = post.folderPath || 'Root'
    if (!grouped[folder]) {
      grouped[folder] = []
    }
    grouped[folder].push(post)
  })

  return grouped
}

/**
 * Build a hierarchical folder structure for navigation
 */
export function getFolderStructure() {
  const posts = getLorePosts()
  const structure: Record<string, FolderStructureNode> = {}

  posts.forEach((post) => {
    const folderPath = post.folderPath || 'Root'
    const pathParts = folderPath === '.' ? ['Root'] : folderPath.split(path.sep)

    let current = structure
    pathParts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          posts: [],
          subfolders: {},
        }
      }

      // If this is the last part, add the post
      if (index === pathParts.length - 1) {
        current[part].posts.push(post)
      }

      current = current[part].subfolders
    })
  })

  return structure
}

/**
 * Extract all WikiLinks from content
 */
function extractWikiLinks(content: string, posts: LorePost[]): string[] {
  const wikiLinkRegex = /\[\[([^\]|]+)(\|[^\]]+)?\]\]/g
  const links: string[] = []
  const index = buildWikiLinkIndex(posts)
  let match

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const pageName = match[1].trim()
    if (!pageName || pageName.startsWith('#')) continue

    const resolved = resolveWikiLinkTargetWithIndex(pageName, index)
    if (resolved) {
      links.push(resolved.routePath)
    }
  }

  return links
}

/**
 * Get all pages that link to a specific page (backlinks)
 */
export function getBacklinks(targetRoutePath: string) {
  const allPosts = getLorePosts()
  const backlinks: Array<{
    routePath: string
    title: string
    folderPath: string
  }> = []

  allPosts.forEach((post) => {
    const links = extractWikiLinks(post.content, allPosts)
    if (links.includes(targetRoutePath)) {
      backlinks.push({
        routePath: post.routePath,
        title: post.metadata.title,
        folderPath: post.folderPath,
      })
    }
  })

  return backlinks
}

/**
 * Build a complete link graph for visualization
 */
export function buildLinkGraph() {
  const allPosts = getLorePosts().filter((post) => post.routePath !== '')
  const nodes = allPosts.map((post) => ({
    id: post.routePath,
    title: post.metadata.title,
    folder: post.folderPath,
  }))

  const links: Array<{ source: string; target: string }> = []
  const routeSet = new Set(allPosts.map((post) => post.routePath))

  allPosts.forEach((post) => {
    const wikiLinks = extractWikiLinks(post.content, allPosts)
    wikiLinks.forEach((targetRoutePath) => {
      // Only add link if target exists
      if (routeSet.has(targetRoutePath)) {
        links.push({
          source: post.routePath,
          target: targetRoutePath,
        })
      }
    })
  })

  return { nodes, links }
}

export function getRouteHref(routePath: string) {
  return routePath ? `/${routePath}` : '/'
}

export function resolveWikiLinkTarget(rawTarget: string, posts = getLorePosts()) {
  const index = buildWikiLinkIndex(posts)
  return resolveWikiLinkTargetWithIndex(rawTarget, index)
}

export function getFallbackRoutePath(rawTarget: string) {
  return getCanonicalWikiLinkTarget(rawTarget)
}
