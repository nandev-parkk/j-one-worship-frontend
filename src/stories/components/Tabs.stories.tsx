import type { Meta, StoryObj } from '@storybook/react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {},
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default (2 Tabs) ─────────────────────────────────── */

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="rounded-md border p-4">
        <h4 className="font-medium">Account</h4>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="rounded-md border p-4">
        <h4 className="font-medium">Settings</h4>
        <p className="text-sm text-muted-foreground">
          Manage your application settings and integrations.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/* ── Line Variant ──────────────────────────────────────── */

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="profile" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="rounded-md border p-4">
        <h4 className="font-medium">Profile</h4>
        <p className="text-sm text-muted-foreground">
          View and edit your public profile information.
        </p>
      </TabsContent>
      <TabsContent value="dashboard" className="rounded-md border p-4">
        <h4 className="font-medium">Dashboard</h4>
        <p className="text-sm text-muted-foreground">
          Your personal dashboard with activity and stats.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

/* ── Vertical ──────────────────────────────────────────── */

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical" className="flex w-96 gap-4">
      <TabsList className="flex flex-col">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <div className="flex-1 rounded-md border p-4">
        <TabsContent value="general">
          <h4 className="font-medium">General Settings</h4>
          <p className="text-sm text-muted-foreground">
            General configuration options for your account.
          </p>
        </TabsContent>
        <TabsContent value="security">
          <h4 className="font-medium">Security</h4>
          <p className="text-sm text-muted-foreground">
            Password, two-factor authentication, and login sessions.
          </p>
        </TabsContent>
        <TabsContent value="notifications">
          <h4 className="font-medium">Notifications</h4>
          <p className="text-sm text-muted-foreground">
            Configure how and when you receive notifications.
          </p>
        </TabsContent>
      </div>
    </Tabs>
  ),
};
