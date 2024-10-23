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
        primary: {
          1: "#33495F",
          2: "#FDC776",
          3: "#F7F1DE",
        },
        secondary: {
          1: "#5281A2",
          2: "#9FA983",
        },
        accent: "#74A7B3",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        drPaws: {
          primary: "#33495F",
          "primary-focus": "#2A3D51", // Slightly darker shade of the navy
          "primary-content": "#FFFFFF", // White text on navy background

          secondary: "#FDC776",
          "secondary-focus": "#FBB85C", // Slightly darker shade of the gold
          "secondary-content": "#33495F", // Navy text on gold background

          accent: "#F7F1DE",
          "accent-focus": "#F0E5C7", // Slightly darker shade of the cream
          "accent-content": "#33495F", // Navy text on cream background

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
