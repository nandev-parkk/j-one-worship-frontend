import type { Meta, StoryObj } from '@storybook/react'

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message here." />
    </div>
  ),
};

/* ── Disabled ──────────────────────────────────────────── */

export const Disabled: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <Label htmlFor="disabled-message">Message</Label>
      <Textarea id="disabled-message" placeholder="Cannot type here..." disabled />
    </div>
  ),
};

/* ── With Value ────────────────────────────────────────── */

export const WithValue: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" defaultValue="I am a developer who loves building beautiful interfaces." />
    </div>
  ),
};

/* ── Different Rows ────────────────────────────────────── */

export const DifferentRows: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="short">Short</Label>
        <Textarea id="short" placeholder="Short textarea" style={{ minHeight: '6rem' }} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="tall">Tall</Label>
        <Textarea id="tall" placeholder="Tall textarea" style={{ minHeight: '12rem' }} />
      </div>
    </div>
  ),
};
