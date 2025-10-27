# Shared config package

This package contains shared configuration for the monorepo:

- ESLint flat config: `eslint.config.js` (exported as `./eslint-config`)
- TypeScript configs: `tsconfig.base.json`, `tsconfig.react.json` (exported under `./tsconfig/*`)
- Prettier config: `prettier.config.cjs` (exported as `./prettier`)

Usage
1. Lint from the repo root using the root helper which re-exports this config:

   pnpm run lint:all

   This runs `eslint` across `./apps/**/src` using the shared `eslint.config.js`.

2. Format from the repo root (root `prettier.config.cjs` re-exports this package's prettier config):

   pnpm run format

Notes
- You don't need to install `eslint` or `prettier` in each package. Keep them installed at the repo root (or in this package) and run the tooling from the root.
- If you prefer package-level scripts, have them call the root binaries (e.g. `pnpm -w exec eslint ...`) or reference the root config file via relative path.
