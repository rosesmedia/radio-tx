import { execFileSync } from 'child_process';
import type { NextConfig } from 'next';

const gitCommit =
  process.env.GIT_REV ??
  execFileSync('/usr/bin/env', ['git', 'rev-parse', 'HEAD']).toString().trim();

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  env: {
    NEXT_PUBLIC_GIT_COMMIT: gitCommit,
  },
  output: 'standalone',
};

export default nextConfig;
