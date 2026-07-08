import type { Meta, StoryObj } from '@storybook/react'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default ───────────────────────────────────────────── */

export const Default: Story = {
  render: () => {
    const components: { title: string; href: string; description: string }[] = [
      {
        title: 'Alert Dialog',
        href: '#',
        description: 'Warn users about an important action.',
      },
      {
        title: 'Hover Card',
        href: '#',
        description: 'For sighted users to preview content.',
      },
      {
        title: 'Progress',
        href: '#',
        description: 'Displays an indicator showing the completion progress.',
      },
      {
        title: 'Toast',
        href: '#',
        description: 'A succinct message displayed temporarily.',
      },
    ];

    return (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    href={component.href}
                    title={component.title}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuViewport />
        <NavigationMenuIndicator />
      </NavigationMenu>
    );
  },
};

function ListItem(props: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={props.href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{props.title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {props.children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
