# @clickyduck/solid-kit

A SolidJS component library with Tailwind CSS and Flowbite, published privately via GitHub Packages.

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Build and clean output first
npm run build:clean

# Build in watch mode
npm run build:watch

# Type check
npm run type:check

# Type check in watch mode
npm run type:watch
```

## Structure

```
source/
  components/   # Reusable UI components
  utilities/    # Utility functions and helpers
```

## Publishing

### 1. Generate a GitHub token

Go to: `GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)`

Create a token with scopes: `write:packages`, `read:packages`, `repo`

### 2. Set the token in your shell

```bash
export GITHUB_TOKEN=your_token_here
```

### 3. Build and publish

```bash
npm run build
npm publish
```

### Subsequent releases

```bash
npm version patch   # 0.1.0 → 0.1.1  (bug fix)
npm version minor   # 0.1.0 → 0.2.0  (new component)
npm version major   # 0.1.0 → 1.0.0  (breaking change)
npm publish
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

### 3. Install

```bash
npm install @clickyduck/solid-kit solid-js tailwindcss
```

### 4. Usage

```tsx
import { Button } from "@clickyduck/solid-kit";

function App() {
  return <Button>Click me</Button>;
}
```

## License

MIT
