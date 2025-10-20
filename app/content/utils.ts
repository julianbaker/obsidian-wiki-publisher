import fs from 'fs'
import path from 'path'
import { slugify } from 'lib/utils'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  category?: string
  published?: boolean
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

function getMarkdownFiles(dir) {
  return fs.readdirSync(dir).filter((file) => {
    const ext = path.extname(file)
    return ext === '.mdx' || ext === '.md'
  })
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

function getMarkdownData(dir) {
  let markdownFiles = getMarkdownFilesRecursive(dir)
  return markdownFiles.map((relativePath) => {
    const fullPath = path.join(dir, relativePath)
    let { metadata, content } = readMarkdownFile(fullPath)
    let slug = path.basename(relativePath, path.extname(relativePath))

    // Convert "Point of Divergence" to "point-of-divergence" using proper slugify
    slug = slugify(slug)

    // Extract folder category if not already set
    if (!metadata.category) {
      metadata.category = extractFolderCategory(relativePath)
    }

    return {
      metadata,
      slug,
      content,
      folderPath: path.dirname(relativePath), // Keep original folder structure
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
  const grouped: Record<string, any[]> = {}

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
  const structure: any = {}

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
function extractWikiLinks(content: string): string[] {
  const wikiLinkRegex = /\[\[([^\]|]+)(\|[^\]]+)?\]\]/g
  const links: string[] = []
  let match

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    // Get the page name (before the | if it exists)
    let pageName = match[1].trim()

    // If pageName includes a path, extract just the filename
    if (pageName.includes('/')) {
      pageName = pageName.split('/').pop()?.trim() || pageName
    }

    // Strip section anchors (e.g., "Page Name#Section" -> "Page Name")
    pageName = pageName.split('#')[0].trim()

    // Convert to slug format to match how pages are referenced
    const slug = slugify(pageName)
    links.push(slug)
  }

  return links
}

/**
 * Get all pages that link to a specific page (backlinks)
 */
export function getBacklinks(targetSlug: string) {
  const allPosts = getLorePosts()
  const backlinks: any[] = []

  allPosts.forEach((post) => {
    const links = extractWikiLinks(post.content)
    if (links.includes(targetSlug)) {
      backlinks.push({
        slug: post.slug,
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
  const allPosts = getLorePosts()
  const nodes = allPosts.map((post) => ({
    id: post.slug,
    title: post.metadata.title,
    folder: post.folderPath,
  }))

  const links: Array<{ source: string; target: string }> = []

  allPosts.forEach((post) => {
    const wikiLinks = extractWikiLinks(post.content)
    wikiLinks.forEach((targetSlug) => {
      // Only add link if target exists
      if (allPosts.find((p) => p.slug === targetSlug)) {
        links.push({
          source: post.slug,
          target: targetSlug,
        })
      }
    })
  })

  return { nodes, links }
}
