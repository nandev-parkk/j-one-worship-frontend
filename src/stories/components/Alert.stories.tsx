import type { Meta, StoryObj } from '@storybook/react'
import { AlertTriangleIcon } from 'lucide-react';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
  args: {},
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Alert className="w-96">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

/* ── Destructive ───────────────────────────────────────── */

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-96">
      <AlertTriangleIcon className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

/* ── With Icon ─────────────────────────────────────────── */

export const WithIcon: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-4">
      <Alert>
        <AlertTriangleIcon className="size-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Changes made will be saved automatically.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTriangleIcon className="size-4" />
        <AlertTitle>Danger</AlertTitle>
        <AlertDescription>
          This action cannot be undone.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
