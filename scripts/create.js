#!/usr/bin/env node

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(filePath, searchValue, replaceValue) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replaceAll(searchValue, replaceValue);
  fs.writeFileSync(filePath, updatedContent);
}

async function main() {
  // Get project name from command line argument
  const projectName = process.argv[2];
  
  if (!projectName) {
    console.error('Please specify a project name:');
    console.error('  pnpm create k2-sass my-app');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);

  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    console.error(`Directory ${projectName} already exists.`);
    process.exit(1);
  }

  console.log(`Creating a new K2-SaaS project in ${targetDir}...`);

  // Create project directory
  fs.mkdirSync(targetDir);

  // Copy template files
  const templateDir = path.join(__dirname, '..');
  const filesToExclude = [
    'node_modules',
    '.git',
    '.turbo',
    'dist',
    'scripts/create.js'
  ];

  function copyRecursively(src, dest) {
    if (filesToExclude.some(exclude => src.includes(exclude))) {
      return;
    }

    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      for (const file of fs.readdirSync(src)) {
        copyRecursively(path.join(src, file), path.join(dest, file));
      }
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  copyRecursively(templateDir, targetDir);

  // Update package names and references
  const filesToUpdate = [
    'package.json',
    'apps/api/package.json',
    'apps/web/package.json',
    'packages/shared-types/package.json',
    'apps/web/src/utils/api.ts',
    'apps/web/src/pages/Documentation.tsx',
    'README.md'
  ];

  for (const file of filesToUpdate) {
    const filePath = path.join(targetDir, file);
    if (fs.existsSync(filePath)) {
      replaceInFile(filePath, 'k2-sass', projectName);
      replaceInFile(filePath, '@k2-saas/', `@${projectName}/`);
    }
  }

  // Initialize git repository
  process.chdir(targetDir);
  execSync('git init', { stdio: 'inherit' });

  // Install dependencies
  console.log('Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  console.log(`
Success! Created ${projectName} at ${targetDir}
Inside that directory, you can run several commands:

  pnpm dev
    Starts the development servers for both frontend and backend.

  pnpm build
    Builds all applications for production.

  pnpm lint
    Lints all source files.

  pnpm format
    Formats all source files.

We suggest that you begin by typing:

  cd ${projectName}
  pnpm dev

Happy coding! 🚀
`);
}

try {
  await main();
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}