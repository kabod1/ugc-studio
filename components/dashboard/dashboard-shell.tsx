"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Megaphone, Users, FileVideo, FileText,
  CreditCard, BarChart3, Settings, Menu, X, Sparkles,
  Bell, ChevronLeft, Video, LogOut, Building2, Palette,
  Shield, UserCheck, Eye, Sliders, MessageSquare
} from "lucide-react"
import { useUser } from "@/hooks/use-user"

const brandNavItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { label: "Creators", href: "/dashboard/creators", icon: Users },
  { label: "Content", href: "/dashboard/content", icon: FileVideo },
  { label: "UGC Videos", href: "/dashboard/ugc-videos", icon: Video },
  { label: "Contracts", href: "/dashboard/contracts", icon: FileText },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Team", href: "/dashboard/settings/team", icon: Users },
]

const creatorNavItems = [
  { label: "Overview", href: "/creator", icon: LayoutDashboard },
  { label: "My Profile", href: "/creator/profile", icon: Palette },
  { label: "Browse Campaigns", href: "/creator/campaigns", icon: Megaphone },
  { label: "My Campaigns", href: "/creator/my-campaigns", icon: FileVideo },
  { label: "My Content", href: "/creator/content", icon: Video },
  { label: "Contracts", href: "/creator/contracts", icon: FileText },
  { label: "Earnings", href: "/creator/earnings", icon: CreditCard },
  { label: "Messages", href: "/creator/messages", icon: MessageSquare },
  { label: "Settings", href: "/creator/settings", icon: Settings },
]

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Brands", href: "/admin/brands", icon: Building2 },
  { label: "Creators", href: "/admin/creators", icon: UserCheck },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Content", href: "/admin/content", icon: Eye },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: Sliders },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Shield },
]

interface DashboardShellProps {
  children: React.ReactNode
  user: any
  role: "brand" | "creator" | "admin"
}

export function DashboardShell({ children, user, role }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { signOut } = useUser()

  const navItems = role === "admin" ? adminNavItems :
    role === "creator" ? creatorNavItems : brandNavItems

  const displayName = user?.full_name || user?.company_name || user?.email || "User"

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-card border-r flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-2 p-4 border-b",
          collapsed ? "justify-center" : ""
        )}>
          <Sparkles className="h-6 w-6 text-primary shrink-0" />
          {!collapsed && <span className="font-bold text-lg">UGC Studio</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== `/${role === "brand" ? "dashboard" : role}` && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center px-2" : ""
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-3">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          )}
          <button
            onClick={signOut}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors",
              collapsed ? "justify-center px-2" : ""
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-7 h-6 w-6 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-muted"
        >
          <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <Link
            href={`/${role === "brand" ? "dashboard" : role}/notifications`}
            className="relative p-2 rounded-md hover:bg-muted"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Link>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
