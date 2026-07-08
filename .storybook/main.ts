import path from 'path'
import { fileURLToPath } from 'url'
import type { StorybookConfig } from '@storybook/react-vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => ({
    ...config,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
    },
  }),
}

export default config