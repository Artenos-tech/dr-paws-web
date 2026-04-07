import Image from "next/image"
import Link from "next/link"

import { blogPosts } from "@/model/mockData"

const BlogsPage = () => {
  const sortedPosts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  return (
    <div className="w-full pb-20">
      <main className="w-full px-8 md:px-32 lg:px-20 xl:px-40">
        <section className="mt-8 md:mt-14 rounded-3xl bg-gradient-to-r from-primary-3 via-[#fff7e6] to-[#f1f7ff] p-6 md:p-10 lg:p-14">
          <p className="text-xs md:text-sm font-secondary uppercase tracking-[0.2em] text-secondary-1">
            Dr. Paws Journal
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-primary text-primary-1">
            Blogs for Better Pet Care
          </h1>
          <p className="mt-4 max-w-3xl text-sm md:text-base font-secondary text-primary-1">
            Practical guides written for pet parents. Explore routines, health
            checklists, and expert-backed care tips from our veterinary team.
          </p>
        </section>

        <section className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
          {sortedPosts.map((post) => (
            <article
              key={post.slug}
              className="group h-full overflow-hidden rounded-2xl border border-[#e7dfcc] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Link
                href={`/blogs/${post.slug}`}
                className="flex h-full flex-col"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute left-4 top-4 rounded-full border border-[#e7dfcc] bg-white px-3.5 py-1.5 text-[11px] font-secondary uppercase tracking-[0.14em] text-primary-1 shadow-[0_6px_18px_rgba(51,73,95,0.12)]">
                    {post.category}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3 text-xs font-secondary text-secondary-1">
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-primary leading-tight text-primary-1">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm font-secondary text-primary-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between gap-4 text-xs font-secondary text-[#6f7d89]">
                      <span>{post.author.name}</span>
                      <span>{post.publishedAt}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <span />
                      <span className="text-sm font-secondary text-secondary-1 transition group-hover:translate-x-1">
                        Read more →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default BlogsPage
