import { resolve } from "path";
import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import solidPlugin from "vite-plugin-solid";
import solidSvg from "vite-plugin-solid-svg";

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
        entry: resolve(__dirname, "source/index.ts"),
        name: "ClickyDuckDesignSystem",
        formats: ["es", "cjs"],
        fileName: (format) => {
          return `index.${format === "es" ? "js" : "cjs"}`;
        }
      },
      rollupOptions: {
        external: ["solid-js", "solid-js/web", "solid-js/store", "@solidjs/router"],
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
