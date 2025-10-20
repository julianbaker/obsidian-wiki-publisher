import { getLorePosts } from './utils'

/**
 * Process Dataview queries at build time
 * Supports basic LIST and TABLE queries
 */

interface DataviewQuery {
  type: 'LIST' | 'TABLE'
  fields?: string[]
  from?: string
  where?: string
  sort?: string
}

/**
 * Parse a dataview query string
 */
function parseDataviewQuery(query: string): DataviewQuery {
  const lines = query.trim().split('\n')
  const firstLine = lines[0].trim()

  const result: DataviewQuery = {
    type: firstLine.startsWith('TABLE') ? 'TABLE' : 'LIST',
  }

  // Parse TABLE fields
  if (result.type === 'TABLE') {
    const tableMatch = firstLine.match(/TABLE\s+(.+?)(?:\s+FROM|$)/i)
    if (tableMatch) {
      result.fields = tableMatch[1].split(',').map(f => f.trim())
    }
  }

  // Parse FROM clause
  const fromMatch = query.match(/FROM\s+["']([^"']+)["']|FROM\s+#(\w+)|FROM\s+(\S+)/i)
  if (fromMatch) {
    result.from = fromMatch[1] || fromMatch[2] || fromMatch[3]
  }

  // Parse WHERE clause
  const whereMatch = query.match(/WHERE\s+(.+?)(?:\s+SORT|$)/is)
  if (whereMatch) {
    result.where = whereMatch[1].trim()
  }

  // Parse SORT clause
  const sortMatch = query.match(/SORT\s+(.+)$/is)
  if (sortMatch) {
    result.sort = sortMatch[1].trim()
  }

  return result
}

/**
 * Filter posts based on FROM clause
 */
function filterByFrom(posts: any[], from?: string) {
  if (!from) return posts

  // FROM "folder/path"
  if (!from.startsWith('#')) {
    return posts.filter(post => {
      const folderPath = post.folderPath || ''
      return folderPath.includes(from) || folderPath.startsWith(from)
    })
  }

  // FROM #tag (if we add tag support later)
  const tag = from.substring(1)
  return posts.filter(post => {
    const tags = post.metadata.tags || []
    return tags.includes(tag)
  })
}

/**
 * Apply WHERE filtering (basic support)
 */
function filterByWhere(posts: any[], where?: string) {
  if (!where) return posts

  return posts.filter(post => {
    // Basic contains check
    const containsMatch = where.match(/contains\(file\.name,\s*["']([^"']+)["']\)/i)
    if (containsMatch) {
      const searchTerm = containsMatch[1].toLowerCase()
      return post.metadata.title.toLowerCase().includes(searchTerm)
    }

    return true
  })
}

/**
 * Execute a dataview query and return markdown
 */
export function executeDataviewQuery(query: string): string {
  const parsed = parseDataviewQuery(query)
  let posts = getLorePosts()

  // Apply filters
  posts = filterByFrom(posts, parsed.from)
  posts = filterByWhere(posts, parsed.where)

  // Sort (default by title)
  posts.sort((a, b) => a.metadata.title.localeCompare(b.metadata.title))

  // Generate output
  if (parsed.type === 'LIST') {
    if (posts.length === 0) {
      return '_No pages found._'
    }
    return posts.map(post => `- [[${post.metadata.title}]]`).join('\n')
  }

  if (parsed.type === 'TABLE') {
    if (posts.length === 0) {
      return '_No pages found._'
    }

    const fields = parsed.fields || ['file.name']
    const headers = ['Page', ...fields.filter(f => f !== 'file.link' && f !== 'file.name')]

    let table = '| ' + headers.join(' | ') + ' |\n'
    table += '| ' + headers.map(() => '---').join(' | ') + ' |\n'

    posts.forEach(post => {
      const row = [`[[${post.metadata.title}]]`]

      fields.forEach(field => {
        if (field === 'file.name' || field === 'file.link') return

        // Handle common fields
        if (field === 'file.folder' || field === 'folder') {
          row.push(post.folderPath || '-')
        } else if (field === 'summary' || field === 'description') {
          row.push(post.metadata.summary?.substring(0, 50) + '...' || '-')
        } else {
          row.push('-')
        }
      })

      table += '| ' + row.join(' | ') + ' |\n'
    })

    return table
  }

  return '_Unsupported query type._'
}

/**
 * Process all dataview code blocks in markdown content
 */
export function processDataviewBlocks(content: string): string {
  // Match dataview code blocks: ```dataview or ```dataviewjs
  const dataviewRegex = /```dataview\s*\n([\s\S]*?)\n```/g

  return content.replace(dataviewRegex, (match, query) => {
    try {
      const result = executeDataviewQuery(query)
      return result
    } catch (error) {
      console.error('Dataview query error:', error)
      return '_Error processing dataview query._'
    }
  })
}

