import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { getLorePosts } from 'app/content/utils'
import { siteName, siteConfig } from 'lib/site-config'

export default function Page() {
  // Find the index page
  const welcomePost = getLorePosts().find((post) => post.slug === 'index')

  if (!welcomePost) {
    return (
      <section>
        <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
          {siteName}
        </h1>
        <p className="mb-4">
          {siteConfig.description}
        </p>
      </section>
    )
  }

  return (
    <section>
      <article className="prose dark:prose-invert max-w-none">
        <CustomMDX source={welcomePost.content} />
      </article>
    </section>
  )
}
