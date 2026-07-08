import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
  },
  args: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter something...',
  },
};

/* ── Placeholder ───────────────────────────────────────── */

export const Placeholder: Story = {
  args: {
    type: 'email',
    placeholder: 'you@example.com',
  },
};

/* ── Disabled ──────────────────────────────────────────── */

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: 'Disabled input',
    disabled: true,
  },
};

/* ── With Label ────────────────────────────────────────── */

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" {...args} />
    </div>
  ),
};

/* ── Variants ──────────────────────────────────────────── */

export const AllTypes: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="text">Text</Label>
        <Input id="text" type="text" placeholder="Text" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="number">Number</Label>
        <Input id="number" type="number" placeholder="Number" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="search">Search</Label>
        <Input id="search" type="search" placeholder="Search..." />
      </div>
    </div>
  ),
};
