"use client"

import Link from "next/link"

export default function VetAtHomePage() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
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
            Now At Your{" "}
            <em className="italic text-[#f0c474]">Doorstep.</em>
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
    </main>
  )
}
