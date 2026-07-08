import type { Meta, StoryObj } from '@storybook/react'

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

/* ── Checked ───────────────────────────────────────────── */

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checked" checked />
      <Label htmlFor="checked">Already accepted</Label>
    </div>
  ),
};

/* ── Disabled ──────────────────────────────────────────── */

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-checked" checked disabled />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
      </div>
    </div>
  ),
};

/* ── Multiple ──────────────────────────────────────────── */

export const Multiple: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="react" checked />
        <Label htmlFor="react">React</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="vue" />
        <Label htmlFor="vue">Vue</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="svelte" checked />
        <Label htmlFor="svelte">Svelte</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="angular" />
        <Label htmlFor="angular">Angular</Label>
      </div>
    </div>
  ),
};
