import { getLorePosts, getRouteHref } from 'app/content/utils'
import { baseUrl } from 'lib/site-config'

export default async function sitemap() {
  let blogs = getLorePosts()
    .filter((post) => post.routePath !== '')
    .map((post) => ({
      url: `${baseUrl}${getRouteHref(post.routePath)}`,
      lastModified: post.metadata.publishedAt,
    }))

  let routes = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
