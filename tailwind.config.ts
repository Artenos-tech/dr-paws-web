import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "primary-1": "#33495F",
        "primary-2": "#FDC776",
        "primary-3": "#F7F1DE",
        accent: "#74A7B3",
        "secondary-1": "#5281A2",
        "secondary-2": "#9FA983",
        tint: "#FFFCF3",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ["light"]
  }
};
export default config;
