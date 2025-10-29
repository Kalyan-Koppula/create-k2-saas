#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import chalk from 'chalk';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Main Function ---
async function run() {
  console.log(chalk.bold.blue('👋 Welcome to create-k2-saas!'));

  // 1. Ask for project name
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What do you want to name your project?',
      validate: (input) => {
        if (/^([a-z0-9-]+)$/.test(input)) return true;
        return 'Project name must be lowercase, with no spaces (e.g., my-awesome-app)';
      },
    },
  ]);

  const { projectName } = answers;

  // 2. Define source and target paths
  const templateDir = path.resolve(__dirname, '..', 'templates', 'default');
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(chalk.red(`\n❌ Directory '${projectName}' already exists.`));
    process.exit(1);
  }

  console.log(chalk.green(`\n🚀 Scaffolding new project in ${targetDir}...`));

  // 3. Copy template files
  try {
    await fs.copy(templateDir, targetDir);
  } catch (err) {
    console.error(chalk.red('Failed to copy files:'), err);
    process.exit(1);
  }

  // 4. Post-processing: Update package.json files and other configs
  console.log(chalk.cyan('🔧 Customizing your files...'));

  // Update root package.json
  updateJsonFile(path.join(targetDir, 'package.json'), (pkg) => {
    pkg.name = projectName;
  });

  // Update README.md
  const readmePath = path.join(targetDir, 'README.md');
  try {
    let readme = fs.readFileSync(readmePath, 'utf8');
    readme = readme.replace(/k2-sass/g, projectName);
    readme = readme.replace(/K2-SaaS/g, projectName);
    fs.writeFileSync(readmePath, readme);
  } catch (e) {
      console.warn(chalk.yellow('Could not update README.md.'));
  }

  // 5. Print final instructions
  console.log(chalk.bold.green('\n✅ Project scaffolded successfully!'));
  console.log('\nNext steps:');
  console.log(chalk.cyan(`  1. cd ${projectName}`));
  console.log(chalk.cyan('  2. pnpm install'));
  console.log(chalk.cyan('  3. (Follow README for D1 setup - you still need to run `pnpm wrangler d1 create ...`)'));
  console.log(chalk.cyan('  4. pnpm dev'));
}

// --- Helper Function ---
function updateJsonFile(filePath, updateCallback) {
  try {
    const json = fs.readJsonSync(filePath);
    updateCallback(json);
    fs.writeJsonSync(filePath, json, { spaces: 2 });
  } catch (err) {
    console.warn(chalk.yellow(`Could not update ${path.basename(filePath)}:`), err.message);
  }
}

// --- Run the script ---
run().catch((err) => {
  console.error(chalk.red('\nAn unexpected error occurred:'), err);
  process.exit(1);
});
