import type { Meta, StoryObj } from '@storybook/react';

import { Shadows } from './Shadows';

const meta = {
  title: 'Design System/Shadows',
  component: Shadows,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Shadows>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
