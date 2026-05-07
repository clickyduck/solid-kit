import type { Config } from "tailwindcss";

export default {
  content: ["./source/**/*.{html,js,jsx,ts,tsx}", "./showcase/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
