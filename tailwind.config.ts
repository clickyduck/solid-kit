import flowbitePlugin from "flowbite/plugin";
import type { Config } from "tailwindcss";

export default {
  content: ["./source/**/*.{html,js,jsx,ts,tsx}", "./showcase/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [flowbitePlugin]
} satisfies Config;
