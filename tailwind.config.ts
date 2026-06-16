import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: "#f4d58d",
          400: "#d6aa4f",
          500: "#a9792b"
        },
        ink: "#050505"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        gold: "0 0 40px rgba(214, 170, 79, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
