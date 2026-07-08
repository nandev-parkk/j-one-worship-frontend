import type { Meta, StoryObj } from '@storybook/react';

import { ColorPalette } from './ColorPalette';

const meta = {
  title: 'Design System/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'gray', value: '#F0F4F8' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColorPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    backgrounds: { override: 'light' },
  },
};
