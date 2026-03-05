"use client"

import Link from "next/link"

export default function VetAtHomePage() {
  return (
    <main
      style={{
        position: "relative",
        minHeight: "calc(100vh - 4rem)",
        overflow: "hidden",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1644675272883-0c4d582528d8?auto=format&fit=crop&fm=jpg&q=80&w=2400')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            .vh-btn-primary {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 15px 30px;
              border-radius: 3px;
              background: linear-gradient(135deg, #e8a44a 0%, #c97a2a 100%);
              color: #140900;
              font-family: var(--font-open-sans), sans-serif;
              font-size: 0.82rem;
              font-weight: 700;
              letter-spacing: 0.1em;
              text-transform: uppercase;
              text-decoration: none;
              box-shadow: 0 4px 16px rgba(232,164,74,0.35);
            }
            .vh-btn-secondary {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              padding: 14px 28px;
              border-radius: 3px;
              border: 1px solid rgba(250,246,240,0.5);
              background: rgba(250,246,240,0.1);
              color: #fff;
              font-family: var(--font-open-sans), sans-serif;
              font-size: 0.82rem;
              font-weight: 500;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              text-decoration: none;
            }
            .vh-stat-card {
              background: rgba(10,7,5,0.45);
              border: 1px solid rgba(232,164,74,0.25);
              border-radius: 6px;
              padding: 18px 24px;
              min-width: 160px;
            }
            @media (max-width: 768px) {
              .vh-stat-cards { display: none !important; }
            }
          `,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)",
          zIndex: 1,
        }}
      />

      {/* HERO CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          minHeight: "calc(100vh - 4rem)",
          padding: "clamp(2rem, 5vw, 5rem) clamp(2rem, 10vw, 10rem)",
        }}
      >
        <div style={{ maxWidth: 580 }}>
          {/* Amber accent line */}
          <span
            style={{
              display: "block",
              width: 64,
              height: 2,
              background: "linear-gradient(90deg, #e8a44a, #f0c474)",
              marginBottom: 28,
            }}
          />

          {/* Eyebrow */}
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#e8a44a",
              margin: "0 0 20px",
            }}
          >
            Premium At-Home Veterinary Care
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.6rem)",
              fontWeight: 900,
              lineHeight: 1.07,
              color: "#faf6f0",
              margin: "0 0 28px",
              letterSpacing: "-0.02em",
            }}
          >
            Dr. Paws Expertise.
            <br />
            Now At Your{" "}
            <em style={{ fontStyle: "italic", color: "#f0c474" }}>Doorstep.</em>
          </h1>

          {/* Body copy */}
          <p
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.08rem)",
              fontWeight: 300,
              lineHeight: 1.78,
              color: "#fff",
              maxWidth: 500,
              margin: "0 0 36px",
            }}
          >
            Professional veterinary care delivered right to your home.
            <br />
            Skip the travel, avoid the stress, and let your pet receive expert
            care where they feel most comfortable.
          </p>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 48,
            }}
          >
            {[
              "Trusted by 17,000+ pet parents",
              "5.0\u2605 rated veterinary clinics",
              "Experienced veterinary doctors",
            ].map((text) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  fontSize: "0.88rem",
                  fontWeight: 400,
                  color: "#fff",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "rgba(232,164,74,0.2)",
                    border: "1px solid rgba(232,164,74,0.55)",
                    flexShrink: 0,
                    color: "#e8a44a",
                  }}
                >
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
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
      <div
        className="vh-stat-cards"
        style={{
          position: "absolute",
          right: "clamp(2rem, 6vw, 6rem)",
          bottom: "clamp(3rem, 8vh, 5rem)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 10,
        }}
      >
        {[
          { num: "17k+", label: "Happy Pet Parents" },
          { num: "5.0\u2605", label: "Average Rating" },
        ].map(({ num, label }) => (
          <div key={label} className="vh-stat-card">
            <div
              style={{
                fontSize: "1.85rem",
                fontWeight: 700,
                color: "#f0c474",
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {num}
            </div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 400,
                color: "rgba(250,246,240,0.7)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
