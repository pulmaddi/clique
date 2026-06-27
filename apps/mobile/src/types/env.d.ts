// Expo inlines EXPO_PUBLIC_* variables into `process.env` at build time.
// Minimal ambient type so the app can read them without pulling @types/node.
declare const process: {
  env: Record<string, string | undefined>;
};
