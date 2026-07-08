import type { Meta, StoryObj } from '@storybook/react'

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
  args: {},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="switch-default" />
      <Label htmlFor="switch-default">Toggle me</Label>
    </div>
  ),
};

/* ── Checked ───────────────────────────────────────────── */

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="switch-checked" checked />
      <Label htmlFor="switch-checked">Already on</Label>
    </div>
  ),
};

/* ── Disabled ──────────────────────────────────────────── */

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="switch-disabled-off" disabled />
        <Label htmlFor="switch-disabled-off">Disabled off</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-disabled-on" checked disabled />
        <Label htmlFor="switch-disabled-on">Disabled on</Label>
      </div>
    </div>
  ),
};

/* ── Sizes ─────────────────────────────────────────────── */

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="switch-default-size" size="default" />
        <Label htmlFor="switch-default-size">Default size</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="switch-sm-size" size="sm" />
        <Label htmlFor="switch-sm-size">Small size</Label>
      </div>
    </div>
  ),
};
