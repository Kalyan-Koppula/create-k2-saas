// root eslint.config.js
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import turboConfig from "eslint-config-turbo";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig([
  // GLOBAL IGNORES
  {
    ignores: [
      "dist",
      "build",
      "node_modules",
      "*.min.js",
      "**/.husky",
      "**/.turbo",
      "**/*.js", // Ignore generated JS files
      "apps/web/vite.config.ts",
    ],
  },

  // SHARED BASE CONFIG FOR ALL TS/TSX FILES (Web & API)
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      turboConfig.configs.recommended,
    ],
    plugins: {
      prettier: prettierPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      // React-specific rules for the entire monorepo
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // Custom config for the API app only (Node environment)
  {
    files: ["apps/api/src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "warn", // Enforce better logging in backend
    },
  },
]);
