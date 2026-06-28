import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL || 'https://dayindayin-site.vercel.app',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: 'desktop',
      use: { viewport: { width: 1280, height: 900 } },
    },
  ],
})
