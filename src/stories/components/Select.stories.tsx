import type { Meta, StoryObj } from '@storybook/react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/* ── With Label ────────────────────────────────────────── */

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="framework">Framework</Label>
      <Select>
        <SelectTrigger className="w-64" id="framework">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

/* ── Disabled ──────────────────────────────────────────── */

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="item1">Item 1</SelectItem>
        <SelectItem value="item2">Item 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

/* ── Disabled Item ─────────────────────────────────────── */

export const DisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="enabled1">Enabled Option</SelectItem>
        <SelectItem value="disabled" disabled>
          Disabled Option
        </SelectItem>
        <SelectItem value="enabled2">Another Enabled</SelectItem>
      </SelectContent>
    </Select>
  ),
};
