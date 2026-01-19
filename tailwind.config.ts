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
        primary: {
          black: "#000000",
          white: "#FFFFFF",
        },
        accent: {
          red: "#DC2626",
          orange: "#F97316",
        },
        gray: {
          light: "#F3F4F6",
          medium: "#6B7280",
          dark: "#1F2937",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["DM Sans", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
