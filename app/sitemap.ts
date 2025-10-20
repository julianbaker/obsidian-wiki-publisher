import { getLorePosts } from 'app/content/utils'
import { baseUrl } from 'lib/site-config'

export default async function sitemap() {
  let blogs = getLorePosts().map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
