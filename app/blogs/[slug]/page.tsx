import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { blogPosts, getBlogBySlug } from "@/model/mockData"

interface BlogDetailPageProps {
  params: {
    slug: string
  }
}

export const generateStaticParams = () => {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

const getParagraphClassName = (
  emphasis?: "italic" | "strong",
  variant?: "default" | "insight",
) => {
  const baseClassName =
    "text-[15px] leading-7 font-secondary text-primary-1 sm:text-base sm:leading-8"
  const insightBaseClassName =
    "text-[15px] leading-7 font-secondary text-[#2f4358] sm:text-base sm:leading-8"

  const resolvedBaseClassName =
    variant === "insight" ? insightBaseClassName : baseClassName

  if (emphasis === "italic") {
    return `${resolvedBaseClassName} italic`
  }

  if (emphasis === "strong") {
    return `${resolvedBaseClassName} font-semibold text-secondary-1`
  }

  return resolvedBaseClassName
}

const BlogDetailPage = ({ params }: BlogDetailPageProps) => {
  const post = getBlogBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = blogPosts
    .filter((blog) => blog.slug !== post.slug)
    .slice(0, 3)

  return (
    <div className="w-full pb-16">
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blogs"
          className="mt-6 inline-flex items-center gap-2 text-sm font-secondary text-secondary-1 hover:underline"
        >
          <span aria-hidden>←</span>
          Back to Blogs
        </Link>

        <article className="mt-4 overflow-hidden rounded-[28px] border border-[#e7dfcc] bg-white shadow-[0_10px_30px_rgba(51,73,95,0.08)]">
          <header className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <p className="text-xs font-secondary uppercase tracking-[0.22em] text-secondary-1">
              {post.category}
            </p>
            <h1 className="mt-3 text-3xl leading-tight font-primary text-primary-1 sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-secondary text-[#6f7d89] sm:text-sm">
              <span className="rounded-full bg-primary-3 px-3 py-1 text-primary-1">
                {post.readTime}
              </span>
              <span className="rounded-full bg-[#f5f8fb] px-3 py-1">
                {post.publishedAt}
              </span>
              <span className="rounded-full bg-[#f5f8fb] px-3 py-1">
                {post.author.name}
              </span>
              <span className="rounded-full bg-[#f5f8fb] px-3 py-1">
                {post.author.role}
              </span>
            </div>
          </header>

          <div className="relative h-60 w-full overflow-hidden sm:h-80 lg:h-[540px]">
            <Image
              src={post.imageUrl}
              alt={post.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#33495f]/25 via-transparent to-transparent" />
          </div>

          <div className="grid gap-8 border-t border-[#efe7d7] px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(0,1fr)_250px] lg:px-10">
            <div>
              {post.sections?.length ? (
                <div className="space-y-8">
                  {post.sections.map((section, sectionIndex) => {
                    const sectionClassName =
                      section.variant === "insight"
                        ? "rounded-2xl border border-[#dcc9a3] border-l-[6px] border-l-secondary-1 bg-[linear-gradient(135deg,#fffaf1_0%,#fff3d9_100%)] p-5 shadow-[0_12px_28px_rgba(170,133,67,0.12)] sm:p-6"
                        : ""
                    const headingClassName =
                      section.variant === "insight"
                        ? "text-xl font-primary text-secondary-1 sm:text-2xl"
                        : "text-2xl font-primary text-primary-1 sm:text-3xl"

                    return (
                      <section
                        key={`${post.slug}-section-${sectionIndex}`}
                        className={sectionClassName}
                      >
                        {section.heading ? (
                          <h2 className={headingClassName}>
                            {section.heading}
                          </h2>
                        ) : null}
                        <div
                          className={
                            section.heading ? "mt-4 space-y-4" : "space-y-4"
                          }
                        >
                          {section.blocks.map((block, blockIndex) => {
                            if (block.type === "list") {
                              return (
                                <ul
                                  key={`${post.slug}-block-${sectionIndex}-${blockIndex}`}
                                  className="space-y-2 pl-5 text-[15px] leading-7 font-secondary text-primary-1 sm:text-base sm:leading-8"
                                >
                                  {block.items.map((item, itemIndex) => (
                                    <li
                                      key={`${post.slug}-item-${sectionIndex}-${blockIndex}-${itemIndex}`}
                                      className="list-disc"
                                    >
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              )
                            }

                            return (
                              <p
                                key={`${post.slug}-block-${sectionIndex}-${blockIndex}`}
                                className={getParagraphClassName(
                                  block.emphasis,
                                  section.variant,
                                )}
                              >
                                {block.text}
                              </p>
                            )
                          })}
                        </div>
                      </section>
                    )
                  })}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {post.content.map((paragraph, index) => (
                      <p
                        key={`${post.slug}-paragraph-${index}`}
                        className="text-[15px] leading-7 font-secondary text-primary-1 sm:text-base sm:leading-8"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {post.vetInsight?.length ? (
                    <section className="mt-8 rounded-2xl border border-[#e7dfcc] bg-[#fffaf1] p-5 sm:p-6">
                      <p className="text-[11px] font-secondary uppercase tracking-[0.18em] text-secondary-1">
                        Vet&apos;s Insight
                      </p>
                      <div className="mt-4 space-y-4">
                        {post.vetInsight.map((paragraph, index) => (
                          <p
                            key={`${post.slug}-insight-${index}`}
                            className="text-[15px] leading-7 font-secondary text-primary-1 sm:text-base sm:leading-8"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  ) : null}
                </>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-[#e7dfcc] bg-[#fffaf1] p-4 sm:p-5">
              <p className="text-[11px] font-secondary uppercase tracking-[0.18em] text-secondary-1">
                Written by
              </p>
              {post.author.imageUrl ? (
                <div className="relative mt-4 h-16 w-16 overflow-hidden rounded-full border border-[#e7dfcc]">
                  <Image
                    src={post.author.imageUrl}
                    alt={post.author.imageAlt ?? post.author.name}
                    fill
                    className="object-cover object-top"
                    sizes="64px"
                  />
                </div>
              ) : null}
              <p className="mt-2 text-lg font-primary text-primary-1">
                {post.author.name}
              </p>
              <p className="mt-1 text-sm font-secondary text-[#6f7d89]">
                {post.author.role}
              </p>
              <div className="mt-4 border-t border-[#e9dfcc] pt-4 text-sm font-secondary text-primary-1">
                <p>{post.publishedAt}</p>
                <p className="mt-1 text-secondary-1">{post.readTime}</p>
              </div>
            </aside>
          </div>
        </article>

        {relatedPosts.length > 0 ? (
          <section className="mt-12 sm:mt-14">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-primary text-primary-1 sm:text-3xl">
                More Blogs
              </h2>
              <Link
                href="/blogs"
                className="text-sm font-secondary text-secondary-1 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blogs/${relatedPost.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#e7dfcc] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={relatedPost.imageUrl}
                      alt={relatedPost.imageAlt}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="text-xs font-secondary text-secondary-1">
                      {relatedPost.category}
                    </p>
                    <h3 className="mt-2 text-lg font-primary leading-snug text-primary-1">
                      {relatedPost.title}
                    </h3>
                    <p className="mt-3 text-sm font-secondary text-primary-1">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

export default BlogDetailPage
