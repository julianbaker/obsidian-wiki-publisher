import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { getLorePosts, getBacklinks, getRouteHref } from 'app/content/utils'
import { baseUrl, siteName } from 'lib/site-config'
import Link from 'next/link'

export async function generateStaticParams() {
  let posts = getLorePosts()

  return posts
    .filter((post) => post.pathSegments.length > 0)
    .map((post) => ({
      slug: post.pathSegments,
    }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const routePath = slug.join('/')
  let post = getLorePosts().find((item) => item.routePath === routePath)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}${getRouteHref(post.routePath)}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const routePath = slug.join('/')
  let post = getLorePosts().find((item) => item.routePath === routePath)

  if (!post) {
    notFound()
  }

  const backlinks = getBacklinks(post.routePath)

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}${getRouteHref(post.routePath)}`,
            author: {
              '@type': 'Person',
              name: siteName,
            },
          }),
        }}
      />
      <article className="prose dark:prose-invert max-w-none">
        <CustomMDX source={post.content} />
      </article>

      {backlinks.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Linked References ({backlinks.length})
          </h2>
          <div className="space-y-2">
            {backlinks.map((backlink) => (
              <Link
                key={backlink.routePath}
                href={getRouteHref(backlink.routePath)}
                className="block p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <p className="text-foreground font-medium">
                  {backlink.title}
                </p>
                {backlink.folderPath && backlink.folderPath !== '.' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {backlink.folderPath}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
