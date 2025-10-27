// Re-export shared ESLint flat config from packages/config so running `eslint` from
// repo root picks up the central config without installing per-package configs.
export { default } from './packages/config/eslint.config.js';
