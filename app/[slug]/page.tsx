import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getLorePosts, getBacklinks } from 'app/content/utils'
import { baseUrl, siteName } from 'lib/site-config'
import Link from 'next/link'

export async function generateStaticParams() {
  let posts = getLorePosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post = getLorePosts().find((post) => post.slug === slug)
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
      url: `${baseUrl}/${post.slug}`,
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

export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post = getLorePosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  const backlinks = getBacklinks(post.slug)

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
            url: `${baseUrl}/${post.slug}`,
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
                key={backlink.slug}
                href={`/${backlink.slug}`}
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
