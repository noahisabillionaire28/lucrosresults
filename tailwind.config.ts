import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#EFEBE5",
        card: "#F5EFE9",
        body: "rgba(0,0,0,0.48)",
        chip: "#E4E0DA",
        accordion: "#E7E7E7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: { card: "24px" },
      boxShadow: {
        glow: "0 10px 30px -8px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
