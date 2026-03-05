"use client"

import Link from "next/link"

export default function VetAtHomePage() {
  const loveAtHomeReasons = [
    {
      title: "Transporting Pets Isn’t Always Easy",
      description:
        "Many pet parents struggle to find pet-friendly transport, especially for large dogs or anxious pets. Our vets come to you instead.",
    },
    {
      title: "Clinics Can Be Stressful for Pets",
      description:
        "New smells, unfamiliar animals, and waiting rooms can cause anxiety. Home visits allow pets to stay calm in familiar surroundings.",
    },
    {
      title: "Senior Pets May Struggle to Travel",
      description:
        "Older pets or pets recovering from illness often find travel uncomfortable. At-home care allows them to receive medical attention without leaving home.",
    },
    {
      title: "Busy Schedules Make Clinic Visits Hard",
      description:
        "Between work, traffic, and daily life, finding time for clinic visits can be difficult. At-home appointments make veterinary care more convenient.",
    },
  ]

  return (
    <main className="w-full">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1644675272883-0c4d582528d8?auto=format&fit=crop&fm=jpg&q=80&w=2400"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 z-[1] bg-black/40" />

        {/* HERO CONTENT */}
        <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center px-[clamp(2rem,10vw,10rem)] py-[clamp(2rem,5vw,5rem)]">
          <div className="max-w-[580px]">
            {/* Amber accent line */}
            <span className="mb-7 block h-[2px] w-16 bg-gradient-to-r from-[#e8a44a] to-[#f0c474]" />

            {/* Eyebrow */}
            <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#e8a44a]">
              Premium At-Home Veterinary Care
            </p>

            {/* Headline */}
            <h1 className="mb-7 text-[clamp(2.5rem,5.5vw,4.6rem)] font-black leading-[1.07] tracking-[-0.02em] text-[#faf6f0]">
              Dr. Paws Expertise.
              <br />
              Now At Your <em className="italic text-[#f0c474]">Doorstep.</em>
            </h1>

            {/* Body copy */}
            <p className="mb-9 max-w-[500px] text-[clamp(0.95rem,1.5vw,1.08rem)] font-light leading-[1.78] text-white">
              Professional veterinary care delivered right to your home.
              <br />
              Skip the travel, avoid the stress, and let your pet receive expert
              care where they feel most comfortable.
            </p>

            {/* Trust badges */}
            <div className="mb-12 flex flex-col gap-3">
              {[
                "Trusted by 17,000+ pet parents",
                "5.0\u2605 rated veterinary clinics",
                "Experienced veterinary doctors",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-[11px] text-[0.88rem] font-normal text-white"
                >
                  <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[rgba(232,164,74,0.55)] bg-[rgba(232,164,74,0.2)] text-[#e8a44a]">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </span>
                  {text}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-[14px]">
              <Link
                href="/user/book-appointment"
                className="font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base bg-secondary-1"
              >
                Book an At-Home Visit
              </Link>

              <Link
                href="https://wa.me/919606994627"
                target="_blank"
                rel="noopener noreferrer"
                className="font-open-sans btn rounded-full text-white px-4 md:px-10 py-2 tracking-wider text-xs md:text-base border border-white bg-transparent hover:bg-white/10"
              >
                Chat on WhatsApp
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="absolute bottom-[clamp(3rem,8vh,5rem)] right-[clamp(2rem,6vw,6rem)] z-10 hidden flex-col gap-3 min-[769px]:flex">
          {[
            { num: "17k+", label: "Happy Pet Parents" },
            { num: "5.0\u2605", label: "Average Rating" },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="min-w-40 rounded-[6px] border border-[rgba(232,164,74,0.25)] bg-[rgba(10,7,5,0.45)] px-6 py-[18px]"
            >
              <div className="mb-1 text-[1.85rem] font-bold leading-none text-[#f0c474]">
                {num}
              </div>
              <div className="text-[0.72rem] font-normal uppercase tracking-[0.08em] text-[rgba(250,246,240,0.7)]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f7f1de_0%,#fcf8ee_45%,#ffffff_100%)] py-16 md:py-20">
        <div className="pointer-events-none absolute -left-16 top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(253,199,118,0.28)_0%,rgba(253,199,118,0)_72%)]" />
        <div className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(82,129,162,0.2)_0%,rgba(82,129,162,0)_75%)]" />

        <div className="mx-auto w-full px-8 md:px-16 lg:px-20 xl:px-40">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight text-primary-1 md:text-5xl">
              Why Pet Parents Prefer Vet-At-Home
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-primary-1/80 md:text-lg">
              The same Dr. Paws expertise, delivered in a way that’s easier for
              both pets and their families.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 md:gap-5">
            {loveAtHomeReasons.map((reason, index) => (
              <article
                key={reason.title}
                className="group relative overflow-hidden rounded-2xl border border-[#e1d5bf] bg-white p-6 shadow-[0_10px_26px_rgba(51,73,95,0.08)] transition-all duration-250 hover:-translate-y-0.5 hover:border-[#c9baa0] hover:shadow-[0_16px_34px_rgba(51,73,95,0.14)] md:p-7"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#fdc776] via-[#f0c474] to-[#5281a2]" />
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fff4de] text-sm font-semibold text-[#94662e]">
                    {index + 1}
                  </span>
                  <span className="h-[1px] flex-1 bg-[#efe4cf]" />
                </div>
                <h3 className="mb-2 text-xl font-semibold leading-snug text-primary-1">
                  {reason.title}
                </h3>
                <p className="text-base leading-relaxed text-primary-1/80">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#e6d8c1] bg-white/80 px-5 py-4 text-center shadow-[0_10px_24px_rgba(51,73,95,0.08)] md:mt-12 md:px-6 md:py-5">
            <p className="text-base font-medium leading-relaxed text-primary-1 md:text-lg">
              No matter the reason, your pet receives the same trusted Dr.
              Paws expertise — just at home.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
