import type { Meta, StoryObj } from '@storybook/react'

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => {
    const tags = Array.from({ length: 50 }, (_, i) => `v1.2.0-beta.${i}`);

    return (
      <ScrollArea className="h-72 w-64 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
          {tags.map((tag, i) => (
            <div key={tag} className="flex items-center gap-4 py-1 text-sm">
              <div>{tag}</div>
              {i < tags.length - 1 && <Separator orientation="vertical" className="h-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
};

/* ── Horizontal ────────────────────────────────────────── */

export const Horizontal: Story = {
  render: () => {
    const items = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

    return (
      <ScrollArea className="w-80 whitespace-nowrap rounded-md border">
        <div className="flex gap-4 p-4">
          {items.map((item) => (
            <div
              key={item}
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-md border text-sm font-medium"
            >
              {item}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  },
};
