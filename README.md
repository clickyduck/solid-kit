# @clickyduck/solid-kit

A SolidJS component library built with Tailwind CSS and Flowbite-style patterns, published privately via GitHub Packages. Import UI pieces from a single package entry point.

## Components

Exports from `@clickyduck/solid-kit` include the following.

| Component    | Main exports                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| Badge        | `Badge`                                                                                                        |
| Button       | `Button`                                                                                                       |
| Card         | `Card`                                                                                                         |
| Dialog       | `Dialog`                                                                                                       |
| Dropdown     | `Dropdown`                                                                                                     |
| Empty state  | `EmptyState`                                                                                                   |
| Field        | `Field`                                                                                                        |
| Header       | `Header`                                                                                                       |
| Heading      | `Heading`                                                                                                      |
| Icon button  | `IconButton`                                                                                                   |
| Icons        | `Icon`, `IconComponent`, named icons (list below); Material Symbols via Fontsource + host CSS — **Installing** |
| Input        | `Input`                                                                                                        |
| Left panel   | `LeftPanel`, `leftPanelNavigationIconByExportName`, related types                                              |
| Loading      | `Loading`                                                                                                      |
| Metric       | `Metric`                                                                                                       |
| Right panel  | `RightPanel`, `RightPanelLayout`                                                                               |
| Spinner      | `Spinner`                                                                                                      |
| Table        | `Table`                                                                                                        |
| Tabs         | `Tabs`, `TabDefinition`, `TabsProperties`                                                                      |
| Textarea     | `Textarea`                                                                                                     |
| Toast        | `Toast`, `Toaster`                                                                                             |
| Toggle group | `ToggleGroup`                                                                                                  |
| Upload       | `Upload`                                                                                                       |

**Named icons** (each is an `IconComponent` you can render like other Solid components): `arrowLeft`, `arrowLeftOnRectangle`, `arrowPath`, `arrowRight`, `arrowRightOnRectangle`, `arrowTrendingUp`, `banknotes`, `barcode`, `bars3`, `calculate`, `calendarDays`, `candlestickChart`, `category`, `chat`, `checkCircle`, `chevronDown`, `chevronRight`, `circle`, `closeCircle`, `confirmationNumber`, `currencyRupee`, `darkMode`, `dashboard`, `documentPlus`, `documentText`, `download`, `ellipsisHorizontal`, `ellipsisVertical`, `exclamationTriangle`, `forum`, `groups`, `home`, `inventory`, `lightMode`, `list`, `menuOpen`, `pencil`, `percent`, `pieChart`, `playCircle`, `plusCircle`, `save`, `scale`, `search`, `settings`, `straighten`, `tag`, `trash`, `upload`, `userCircle`, `userPlus`, `visibility`, `wallet`, `work`.

## Development

```bash
# Install dependencies
npm install

# Showcase / local Vite
npm run development

# Build the library (removes public/ output first, then vite build)
npm run build

# Build with file watcher
npm run build -- --watch

# Type check
npm run typecheck

# Type check with file watcher
npm run typecheck -- --watch

# Type check then build (no publish; same as prepublishOnly)
npm run typecheck && npm run build

# Format sources
npm run format
```

## Structure

```
source/
  components/   # Reusable UI components
  utilities/    # Utility functions and helpers
material-symbols-rounded-glyph-host.css   # Published with the package: .material-symbols-rounded + variation defaults
```

## Publishing

This section is the full checklist for publishing **`@clickyduck/solid-kit`** to GitHub Packages.

### Build, typecheck, and release (how they relate)

| Command               | What it does                                                                                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`npm run build`**   | Deletes the **`public/`** output folder, then runs the Vite library build. Produces the files that ship inside the package (see **`files`** in **`package.json`**). Use this when you only want a local build (for example to inspect output). |
| **`npm run release`** | Runs **`prepublishOnly`** (**`npm run typecheck`** then **`npm run build`**), then **`npm publish`** with **`GITHUB_TOKEN`** loaded from **`.env`** via **`dotenv-cli`**.                                                                    |

You **do not** need to run **`npm run build`** manually immediately before **`npm run release`**: **`prepublishOnly`** already runs typecheck and build. Before **`npm version`**, run **`npm run typecheck && npm run build`** so you do not tag a commit that fails typecheck or build (**`npm version`** does not run those steps). Run **`npm run typecheck`**, **`npm run build`**, or both in sequence any time you want to confirm output locally.

### 1. One-time setup: GitHub token

Go to: `GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)`.

Create a token with scopes: **`write:packages`**, **`read:packages`**, **`repo`**.

### 2. One-time setup: credentials for publish

Copy **`.env.example`** to **`.env`** and set **`GITHUB_TOKEN`** to that token. The **`release`** script loads **`.env`** with **`dotenv-cli`**, so you do not need to export the variable in your shell for publishing from this repository.

Alternatively, export it in the shell: `export GITHUB_TOKEN=your_token_here` (Unix) or set **`GITHUB_TOKEN`** in Windows environment variables (then you still use **`npm run release`**; the file is optional if the variable is already set for the process).

### 3. Before you version or publish

1. Commit or stash every change you want in the release. **`npm version`** creates a git commit; it refuses a dirty working tree unless you pass flags you should use only when you know why.
2. Run **`npm run typecheck && npm run build`** before **`npm version`** so the tagged commit is known good.
3. Push your branch as usual so collaborators see your commits before you tag.
4. Confirm **`.env`** exists with **`GITHUB_TOKEN`** if you rely on the file (see step 2).

### 4. Bump the package version (git commit, tag, push)

Pick one of **`patch`**, **`minor`**, or **`major`** depending on semver:

```bash
npm version patch   # 0.1.0 → 0.1.1  (bug fixes, compatible changes)
npm version minor   # 0.1.0 → 0.2.0  (new features, backward compatible)
npm version major   # 0.1.0 → 1.0.0  (breaking changes)
```

What **`npm version`** does in this repository:

1. Updates the **`version`** field in **`package.json`** (and **`package-lock.json`** if npm updates it).
2. Creates a git commit for that version bump and a git tag (for example **`v0.1.1`**).
3. **`postversion`**: runs **`git push --follow-tags`** so the commit and tag are on the remote.

If **`postversion`** fails to push, fix your remote or credentials, then run **`git push --follow-tags`** manually so the version commit and tag reach the remote.

### 5. Publish the new version to GitHub Packages

After step 4 succeeds:

```bash
npm run release
```

What **`npm run release`** does:

1. **`prepublishOnly`**: runs **`npm run typecheck`** then **`npm run build`** so the tarball matches current sources.
2. **`npm publish`** to the registry configured in **`publishConfig`** (GitHub Packages for this package), using **`GITHUB_TOKEN`** from **`.env`** when you use **`dotenv-cli`** as in the script.

First-time publish from a machine: same commands; ensure the package name and registry scope match your GitHub organization and **`.npmrc`**.

### 6. Optional commands (no version bump)

Inspect the packed tarball without uploading:

```bash
npm run release -- --dry-run
```

Typecheck and build only (no **`npm version`**, no publish):

```bash
npm run typecheck && npm run build
```

Library build only (no typecheck):

```bash
npm run build
```

## Installing in another project

### 1. Add an `.npmrc` to the consumer project

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@clickyduck:registry=https://npm.pkg.github.com
```

### 2. Set the token in your shell

The consumer needs a GitHub token with `read:packages` scope.

```bash
export GITHUB_TOKEN=your_token_here
```

### 3. Install packages

```bash
npm install @clickyduck/solid-kit solid-js tailwindcss @fontsource-variable/material-symbols-rounded
```

`@fontsource-variable/material-symbols-rounded` is a **peer dependency**: kit icons expect **Material Symbols Rounded** with **FILL 1** (filled), self-hosted from that package. Names match the [Material Symbols](https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Rounded) catalogue.

### 4. Load fonts (default icons)

Fontsource ships `@font-face` only. Import its CSS **first**, then the kit **glyph host** layer (defines `.material-symbols-rounded`, `font-family`, and `font-variation-settings`). You can copy those rules into your own global CSS instead of importing the host file.

```css
@import "@fontsource-variable/material-symbols-rounded/full.css";
@import "@clickyduck/solid-kit/material-symbols-rounded-glyph-host.css";
```

From TypeScript or JavaScript (order matters):

```tsx
import "@clickyduck/solid-kit/material-symbols-rounded-glyph-host.css";
import "@fontsource-variable/material-symbols-rounded/full.css";
```

For a smaller bundle, import specific axis files from Fontsource instead of `full.css`; keep the host import **after** the `@font-face` rules.

### 5. Usage

```tsx
import { Button } from "@clickyduck/solid-kit";

function App() {
  return <Button>Click me</Button>;
}
```

## License

MIT
