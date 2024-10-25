import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roca: ["Roca", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"],
      },
      colors: {
        "primary-1": "#33495F",
        "primary-2": "#FDC776",
        "primary-3": "#F7F1DE",
        "secondary-1": "#5281A2",
        "secondary-2": "#9FA983",
        accent: "#74A7B3",
        background: "var(--background)",
        foreground: "var(--foreground)",
        tint: "#FFFCF3",
      },
      backgroundImage: {
        banner: "url('/assets/images/home-banner.png')",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        drPaws: {
          primary: "#33495F",
          "primary-focus": "#293A4C",
          "primary-content": "#FFFFFF",

          secondary: "#5281A2",
          "secondary-focus": "#426782",
          "secondary-content": "#FFFFFF",

          accent: "#74A7B3",
          "accent-focus": "#538B99",
          "accent-content": "#FFFFFF",

          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
        },
      },
    ],
  },
};
export default config;
