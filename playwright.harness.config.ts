import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/harness', timeout: 30000, workers: 1,
  use: { baseURL: 'http://localhost:4181', headless: true },
  projects: [
    { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'webkit', use: { browserName: 'webkit', viewport: { width: 390, height: 844 } } },
  ],
  webServer: { command: 'npm run preview -- --host localhost --port 4181 --strictPort', url: 'http://localhost:4181', reuseExistingServer: false },
});
