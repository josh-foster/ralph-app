import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { Home, Columns3 } from 'lucide-react'
import WorkOSHeader from './workos-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const navMain = [
  {
    title: 'Home',
    url: '/' as const,
    icon: Home,
  },
  {
    title: 'Boards',
    url: '/boards' as const,
    icon: Columns3,
  },
]

// const navDemos = [
//   {
//     title: 'Server Functions',
//     url: '/demo/start/server-funcs' as const,
//     icon: SquareFunction,
//   },
//   {
//     title: 'API Request',
//     url: '/demo/start/api-request' as const,
//     icon: Network,
//   },
//   {
//     title: 'SSR Demos',
//     url: '/demo/start/ssr' as const,
//     icon: StickyNote,
//     items: [
//       { title: 'SPA Mode', url: '/demo/start/ssr/spa-mode' as const },
//       { title: 'Full SSR', url: '/demo/start/ssr/full-ssr' as const },
//       { title: 'Data Only', url: '/demo/start/ssr/data-only' as const },
//     ],
//   },
//   {
//     title: 'Convex',
//     url: '/demo/convex' as const,
//     icon: Globe,
//   },
//   {
//     title: 'WorkOS',
//     url: '/demo/workos' as const,
//     icon: CircleUserRound,
//   },
//   {
//     title: 'Sentry',
//     url: '/demo/sentry/testing' as const,
//     icon: FlaskConical,
//   },
// ]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup>
          <SidebarGroupLabel>Demos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navDemos.map((item) =>
                item.items ? (
                  <Collapsible.Root key={item.title} asChild>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <Collapsible.Trigger asChild>
                        <SidebarMenuButton className="w-auto px-2">
                          <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </Collapsible.Trigger>
                      <Collapsible.Content>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </Collapsible.Content>
                    </SidebarMenuItem>
                  </Collapsible.Root>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <WorkOSHeader />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
