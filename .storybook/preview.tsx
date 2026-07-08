import type { Preview } from '@storybook/react-vite'

// Import global styles
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'gray', value: '#F0F4F8' },
        { name: 'blue-light', value: '#E8F1FB' },
      ],
    },
    a11y: {
      test: 'todo',
    },
  },
  tags: ['autodocs'],
}

export default preview
