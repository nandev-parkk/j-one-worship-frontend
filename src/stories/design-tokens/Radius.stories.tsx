import type { Meta, StoryObj } from '@storybook/react';

import { Radius } from './Radius';

const meta = {
  title: 'Design System/Radius',
  component: Radius,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Radius>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
