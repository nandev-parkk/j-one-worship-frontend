import type { Meta, StoryObj } from '@storybook/react'
import { ArrowRightIcon, HeartIcon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Variants ─────────────────────────────────────────── */

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

/* ── Sizes ────────────────────────────────────────────── */

export const Small: Story = {
  args: {
    children: 'Small',
    size: 'sm',
  },
};

export const SizeDefault: Story = {
  args: {
    children: 'Default',
    size: 'default',
  },
};

export const Large: Story = {
  args: {
    children: 'Large',
    size: 'lg',
  },
};

export const Icon: Story = {
  args: {
    children: <HeartIcon />,
    size: 'icon',
  },
};

/* ── With Icon ────────────────────────────────────────── */

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>
        <ArrowRightIcon />
        Continue
      </Button>
      <Button variant="outline">
        <HeartIcon />
        Favorite
      </Button>
      <Button variant="destructive">
        <TrashIcon />
        Delete
      </Button>
    </div>
  ),
};

/* ── Disabled ─────────────────────────────────────────── */

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button disabled>Disabled</Button>
      <Button variant="outline" disabled>Outline Disabled</Button>
      <Button variant="secondary" disabled>Secondary Disabled</Button>
      <Button variant="destructive" disabled>Destructive Disabled</Button>
      <Button variant="ghost" disabled>Ghost Disabled</Button>
    </div>
  ),
};

/* ── Gradient (Blue) ─────────────────────────────────── */

export const Gradient: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-8 rounded-xl">
      <Button
        className="bg-gradient-to-r from-blue-500 to-blue-400 text-white border-0"
      >
        Gradient
      </Button>
      <Button
        className="bg-gradient-to-r from-blue-500 to-blue-400 text-white border-0 shadow-lg shadow-blue-500/30"
      >
        Gradient Glow
      </Button>
      <Button
        variant="outline"
        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-400 border-blue-500/50"
      >
        Gradient Text
      </Button>
    </div>
  ),
};
