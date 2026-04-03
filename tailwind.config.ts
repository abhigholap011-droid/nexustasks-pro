import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "glass-border": "var(--glass-border)",
        "glass-highlight": "var(--glass-highlight)",
      },
      backgroundImage: {
        "accent-gradient": "var(--accent-gradient)",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        "glass": "var(--glass-shadow)",
        "glass-hover": "0 12px 40px 0 rgba(0, 0, 0, 0.45), 0 0 20px var(--glow-color)",
        "glow": "0 0 15px var(--glow-color)",
      }
    },
  },
  plugins: [],
};
export default config;
