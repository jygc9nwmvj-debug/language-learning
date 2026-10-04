import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', timeout: 45000, workers: 1,
  use: { baseURL: 'http://localhost:4173', headless: true, screenshot: 'only-on-failure' },
  projects: [
    { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome', launchOptions: { args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--mute-audio'] } } },
    { name: 'webkit', testMatch: ['install.spec.ts', 'matching.spec.ts', 'action-zone-audit.spec.ts', 'resolution-contract.spec.ts', 'text-coverage.spec.ts', 'interaction-consolidation.spec.ts', 'stable-layout.spec.ts', 'inline-feedback.spec.ts', 'p1-audit.spec.ts', 'visual-focus.spec.ts', 'visual-v05.spec.ts', 'continuous-boundaries.spec.ts', 'hybrid.spec.ts', 'observability.spec.ts', 'assessment-intent.spec.ts', 'recording-reliability.spec.ts', 'product-ui.spec.ts', 'introduction.spec.ts', 'comprehension.spec.ts', 'attention.spec.ts', 'flow-lite.spec.ts', 'polish.spec.ts', 'continuous.spec.ts', 'flow.spec.ts', 'audio-speech.spec.ts', 'audio.spec.ts', 'repair.spec.ts', 'hosting.spec.ts', 'writing.spec.ts', 'trust.spec.ts', 'continue.spec.ts'], use: { browserName: 'webkit' } },
  ],
  webServer: { command: 'npm run preview -- --host localhost --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: true },
});
