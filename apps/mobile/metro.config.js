// Metro config for a pnpm monorepo (Expo).
// Lets Metro find the workspace root + the @bhakti-setu/shared package and
// resolve dependencies hoisted to the repo-root node_modules.
// See: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole monorepo so changes in packages/* trigger reloads.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the app first, then the workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. pnpm uses symlinks + a non-flat store; keep resolution predictable.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
