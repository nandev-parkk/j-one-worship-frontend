import type { Meta, StoryObj } from '@storybook/react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        Simple card content without header or footer.
      </CardContent>
    </Card>
  ),
};

/* ── With Header, Content, Footer ─────────────────────── */

export const WithHeaderContentFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader className="border-b">
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        This is the card content area. You can put anything here.
      </CardContent>
      <CardFooter className="border-t pt-6">
        <div className="flex w-full justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

/* ── Multiple Cards ────────────────────────────────────── */

export const MultipleCards: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card className="w-64">
        <CardHeader className="border-b">
          <CardTitle>Free</CardTitle>
          <CardDescription>For individuals</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-3xl font-bold">$0</p>
          <p className="text-sm text-muted-foreground">Free forever</p>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button variant="outline" className="w-full">Get Started</Button>
        </CardFooter>
      </Card>
      <Card className="w-64">
        <CardHeader className="border-b">
          <CardTitle>Pro</CardTitle>
          <CardDescription>For teams</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-3xl font-bold">$10</p>
          <p className="text-sm text-muted-foreground">Per month</p>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button className="w-full">Upgrade</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
