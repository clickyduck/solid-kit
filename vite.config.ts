import { resolve } from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import solidPlugin from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";

const componentEntries: Record<string, string> = {
  badge: resolve(__dirname, "source/components/badge/index.ts"),
  button: resolve(__dirname, "source/components/button/index.ts"),
  card: resolve(__dirname, "source/components/card/index.ts"),
  "date-picker": resolve(__dirname, "source/components/date-picker/index.ts"),
  dialog: resolve(__dirname, "source/components/dialog/index.ts"),
  divider: resolve(__dirname, "source/components/divider/index.ts"),
  dropdown: resolve(__dirname, "source/components/dropdown/index.ts"),
  "empty-state": resolve(__dirname, "source/components/empty-state/index.ts"),
  field: resolve(__dirname, "source/components/field/index.ts"),
  "header-layout": resolve(__dirname, "source/components/header-layout/index.ts"),
  "icon-button": resolve(__dirname, "source/components/icon-button/index.ts"),
  icons: resolve(__dirname, "source/components/icons/index.ts"),
  input: resolve(__dirname, "source/components/input/index.ts"),
  "left-panel-layout": resolve(__dirname, "source/components/left-panel-layout/index.ts"),
  link: resolve(__dirname, "source/components/link/index.ts"),
  loading: resolve(__dirname, "source/components/loading/index.ts"),
  "main-layout": resolve(__dirname, "source/components/main-layout/index.ts"),
  "page-layout": resolve(__dirname, "source/components/page-layout/index.ts"),
  "right-panel-layout": resolve(__dirname, "source/components/right-panel-layout/index.ts"),
  "section-heading": resolve(__dirname, "source/components/section-heading/index.ts"),
  spinner: resolve(__dirname, "source/components/spinner/index.ts"),
  table: resolve(__dirname, "source/components/table/index.ts"),
  tabs: resolve(__dirname, "source/components/tabs/index.ts"),
  textarea: resolve(__dirname, "source/components/textarea/index.ts"),
  toast: resolve(__dirname, "source/components/toast/index.ts"),
  "toggle-group": resolve(__dirname, "source/components/toggle-group/index.ts"),
  typography: resolve(__dirname, "source/components/typography/index.ts"),
  upload: resolve(__dirname, "source/components/upload/index.ts"),
  utilities: resolve(__dirname, "source/utilities/index.ts")
};

export default defineConfig(({ command }) => {
  const sharedResolve = {
    alias: {
      "@": resolve(__dirname, "source")
    },
    conditions: ["development", "browser"] as const
  };

  if (command === "serve") {
    return {
      root: resolve(__dirname, "showcase"),
      plugins: [solidPlugin(), solidSvg({ defaultAsComponent: true })],
      resolve: sharedResolve,
      server: {
        open: true
      }
    };
  }

  return {
    plugins: [
      solidPlugin(),
      solidSvg({ defaultAsComponent: true }),
      dtsPlugin({
        insertTypesEntry: true,
        rollupTypes: true,
        tsconfigPath: "./tsconfig.json"
      })
    ],
    build: {
      outDir: "public",
      lib: {
        entry: {
          index: resolve(__dirname, "source/index.ts"),
          ...componentEntries
        },
        formats: ["es", "cjs"],
        fileName: (format, entryName) => `${entryName}.${format === "es" ? "js" : "cjs"}`
      },
      rollupOptions: {
        external: [/^solid-js/, "@solidjs/router", /^@material-symbols\//, /^material-symbols(\/.*)?$/, "clsx", "tailwind-merge"],
        output: {
          globals: {
            "solid-js": "SolidJS",
            "solid-js/web": "SolidJSWeb"
          }
        }
      },
      sourcemap: true
    },
    resolve: sharedResolve
  };
});
