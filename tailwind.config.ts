import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-roca)", "sans-serif"],
        secondary: ["var(--font-open-sans)", "sans-serif"],
      },
      colors: {
        "primary-1": "var(--primary-1)",
        "primary-2": "var(--primary-2)",
        "primary-3": "var(--primary-3)",
        "secondary-1": "var(--secondary-1)",
        "secondary-2": "var(--secondary-2)",
        accent: "var(--accent)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        tint: "#FFFCF3",
      },
      backgroundImage: {
        banner: "url('/assets/images/home-banner.png')",
      },
    },
  },
  plugins: [],
};
export default config;
