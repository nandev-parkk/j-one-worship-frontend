import type { Meta, StoryObj } from '@storybook/react'

import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Horizontal ────────────────────────────────────────── */

export const Horizontal: Story = {
  render: () => (
    <section className="w-96">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </section>
  ),
};

/* ── Vertical ──────────────────────────────────────────── */

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-sm">Before</div>
      <Separator orientation="vertical" className="h-8" />
      <div className="text-sm">After</div>
    </div>
  ),
};

/* ── Between Sections ──────────────────────────────────── */

export const BetweenSections: Story = {
  render: () => (
    <section className="w-96">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Project</h4>
        <p className="text-sm text-muted-foreground">
          Open source components for building beautiful apps.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Team</h4>
        <p className="text-sm text-muted-foreground">
          A team of developers building the future of UI.
        </p>
      </div>
    </section>
  ),
};
