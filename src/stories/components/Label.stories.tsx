import type { Meta, StoryObj } from '@storybook/react'

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const meta = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="name@example.com" />
    </div>
  ),
};

/* ── With Checkbox ─────────────────────────────────────── */

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

/* ── Multiple Labels ───────────────────────────────────── */

export const Multiple: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="first-name">First name</Label>
        <Input id="first-name" placeholder="John" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="last-name">Last name</Label>
        <Input id="last-name" placeholder="Doe" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>
    </div>
  ),
};
