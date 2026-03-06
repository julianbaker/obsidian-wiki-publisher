#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = path.join(process.cwd(), 'app', 'content', 'posts')
const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx'])

function slugify(value) {
  return value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function collectMarkdownFiles(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.')) {
        files.push(...collectMarkdownFiles(fullPath, baseDir))
      }
      continue
    }

    if (MARKDOWN_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(path.relative(baseDir, fullPath))
    }
  }

  return files
}

function normalizeRouteSegments(segments) {
  const normalized = segments
    .map((segment) => slugify(segment.trim()))
    .filter(Boolean)

  if (normalized.length === 1 && normalized[0] === 'index') {
    return []
  }

  if (
    normalized.length > 1 &&
    normalized[normalized.length - 1] === normalized[normalized.length - 2]
  ) {
    normalized.pop()
  }

  return normalized
}

function getRoutePath(relativePath) {
  const ext = path.extname(relativePath)
  const withoutExt = relativePath.slice(0, -ext.length)
  const segments = normalizeRouteSegments(withoutExt.split(path.sep))
  return segments.join('/')
}

function getLinkTarget(raw) {
  const withoutAnchor = raw.split('#')[0].trim()
  if (!withoutAnchor || withoutAnchor.startsWith('#')) return ''
  return normalizeRouteSegments(withoutAnchor.split('/')).join('/')
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(POSTS_DIR, relativePath), 'utf8')
}

if (!fs.existsSync(POSTS_DIR)) {
  console.error(`Missing posts directory: ${POSTS_DIR}`)
  process.exit(1)
}

const files = collectMarkdownFiles(POSTS_DIR)
const routeOwners = new Map()
const slugIndex = new Map()
const posts = []

for (const relativePath of files) {
  const routePath = getRoutePath(relativePath)
  const fileStem = path.basename(relativePath, path.extname(relativePath))
  const slug = slugify(fileStem)

  if (routeOwners.has(routePath)) {
    console.error(`Route collision: "${relativePath}" and "${routeOwners.get(routePath)}" both map to "/${routePath}"`)
    process.exit(1)
  }

  routeOwners.set(routePath, relativePath)

  const existing = slugIndex.get(slug) ?? []
  existing.push(relativePath)
  slugIndex.set(slug, existing)

  posts.push({ relativePath, routePath, slug, content: readFile(relativePath) })
}

const ambiguousBareLinks = []
const wikiLinkRegex = /\[\[([^\]|]+)(\|[^\]]+)?\]\]/g

for (const post of posts) {
  let match
  while ((match = wikiLinkRegex.exec(post.content)) !== null) {
    const rawTarget = match[1].trim()
    if (!rawTarget || rawTarget.startsWith('#') || rawTarget.includes('/')) continue

    const targetSlug = slugify(rawTarget)
    const candidates = slugIndex.get(targetSlug) ?? []
    if (candidates.length > 1) {
      ambiguousBareLinks.push({
        file: post.relativePath,
        link: rawTarget,
        candidates,
      })
    }

    // Keep this logic in sync with runtime conversion.
    getLinkTarget(rawTarget)
  }
}

if (ambiguousBareLinks.length > 0) {
  console.error('Found ambiguous bare WikiLinks. Use path-qualified links instead (e.g. [[Folder/Page]]):')
  for (const issue of ambiguousBareLinks) {
    console.error(`- ${issue.file}: [[${issue.link}]] matches ${issue.candidates.join(', ')}`)
  }
  process.exit(1)
}

console.log(`Validated ${posts.length} markdown files: no route collisions, no ambiguous bare WikiLinks.`)
