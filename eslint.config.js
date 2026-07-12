import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import betterTailwind from "eslint-plugin-better-tailwindcss";

export default [
  {
    ignores: ["build"]
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        process: "readonly",
        HTMLDivElement: "readonly",
        KeyboardEvent: "readonly",
        Event: "readonly",
        setTimeout: "readonly",
        clearInterval: "readonly",
        localStorage: "readonly",
        __dirname: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "better-tailwindcss": betterTailwind
    },
    settings: {
      "better-tailwindcss": {
        // Tailwind v4 has no JS config to resolve theme/content from — point the plugin at the
        // showcase's Tailwind entry (the one file that does `@import "tailwindcss"`) so it reads
        // the same utility set the app builds against.
        entryPoint: "showcase/showcaseGlobalStyles.css",
        // Class strings reach JSX through our `mergeClasses(...)` wrapper (twMerge + clsx) as well
        // as plain `class={...}`. The default attribute matchers already cover `class`; register the
        // wrapper as a callee so its string arguments get linted too. Matching the default callee
        // shape: [namePattern, [{ match: "strings" }]].
        callees: [["^mergeClasses$", [{ match: "strings" }]]]
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
      "no-undef": "off",
      // Collapse verbose utilities into their Tailwind shorthand (`[&>*]:max-h-10` -> `*:max-h-10`,
      // `pt-2 pb-2` -> `py-2`, etc.). Autofixable, so `eslint --fix` rewrites them. Errors, so the
      // `--max-warnings=0` lint script blocks on them the same way the editor's squiggle flags them.
      "better-tailwindcss/enforce-shorthand-classes": "error",
      // Collapsing two utilities into one leaves a double space at the seam; this rule (also
      // autofixable) trims that leftover so the same `eslint --fix` pass converges to clean strings,
      // including the `mergeClasses(...)` args that prettier-plugin-tailwindcss doesn't reformat.
      "better-tailwindcss/no-unnecessary-whitespace": "error"
    }
  }
];
