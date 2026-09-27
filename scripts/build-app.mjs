import { build } from 'vite';
// Only this dedicated preview branch enables the harness on Cloudflare.
const test = process.argv[2] === 'test' || process.env.CF_PAGES_BRANCH === 'a1-test-harness';
await build({ mode: test ? 'test' : 'production' });
