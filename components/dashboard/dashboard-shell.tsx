"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Megaphone, Users, FileVideo, FileText,
  CreditCard, BarChart3, Settings, Menu,
  Bell, ChevronLeft, Video, LogOut, Building2, Palette,
  Shield, UserCheck, Eye, Sliders, MessageSquare, HelpCircle,
  BookOpen, Briefcase, Share2, Mail, X, ArrowLeftRight, Loader2
} from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { LogoIcon, LogoHorizontal } from "@/components/shared/logo"

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
  { label: "Brand Kit", href: "/dashboard/settings/brand", icon: Palette },
  { label: "Billing", href: "/dashboard/settings/billing", icon: Settings },
  { label: "Team", href: "/dashboard/settings/team", icon: Users },
]

const creatorNavItems = [
  { label: "Overview", href: "/creator", icon: LayoutDashboard },
  { label: "My Profile", href: "/creator/profile", icon: Palette },
  { label: "Browse Campaigns", href: "/creator/campaigns", icon: Megaphone },
  { label: "Brands", href: "/creator/brands", icon: Building2 },
  { label: "My Campaigns", href: "/creator/my-campaigns", icon: FileVideo },
  { label: "My Content", href: "/creator/content", icon: Video },
  { label: "Portfolio", href: "/creator/portfolio", icon: Briefcase },
  { label: "Training", href: "/creator/training", icon: BookOpen },
  { label: "Contracts", href: "/creator/contracts", icon: FileText },
  { label: "Earnings", href: "/creator/earnings", icon: CreditCard },
  { label: "Affiliates", href: "/creator/affiliates", icon: Share2 },
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
  { label: "Outreach", href: "/admin/outreach", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Shield },
]

// The 4 most important items per role shown in the mobile bottom bar
const brandBottomNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { label: "Content", href: "/dashboard/content", icon: FileVideo },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
]
const creatorBottomNav = [
  { label: "Overview", href: "/creator", icon: LayoutDashboard },
  { label: "Campaigns", href: "/creator/campaigns", icon: Megaphone },
  { label: "Content", href: "/creator/content", icon: Video },
  { label: "Earnings", href: "/creator/earnings", icon: CreditCard },
]
const adminBottomNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Outreach", href: "/admin/outreach", icon: Mail },
]

interface DashboardShellProps {
  children: React.ReactNode
  user: any
  role: "brand" | "creator" | "admin"
  isAdmin?: boolean
}

export function DashboardShell({ children, user, role, isAdmin }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [switching, setSwitching] = useState(false)
  const pathname = usePathname()
  const { signOut } = useUser()

  async function handleRoleSwitch(targetRole: "brand" | "creator") {
    setSwitching(true)
    if (isAdmin) {
      // Admin navigates directly — no role change needed, layouts accept admin role
      window.location.href = targetRole === "brand" ? "/dashboard" : "/creator"
      return
    }
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      })
      const data = await res.json()
      if (data.redirectTo) {
        window.location.href = data.redirectTo
      } else {
        setSwitching(false)
      }
    } catch {
      setSwitching(false)
    }
  }

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const navItems = role === "admin" ? adminNavItems :
    role === "creator" ? creatorNavItems : brandNavItems

  const bottomNavItems = role === "admin" ? adminBottomNav :
    role === "creator" ? creatorBottomNav : brandBottomNav

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
        {/* Logo + mobile close button */}
        <div className={cn(
          "flex items-center gap-2 p-4 border-b",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {collapsed ? <LogoIcon size={32} /> : <LogoHorizontal />}
          {!collapsed && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-muted"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== `/${role === "brand" ? "dashboard" : role}` && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed ? "justify-center px-2" : ""
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-3 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-2 px-2 py-2 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            </div>
          )}
          {/* Role switcher */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors",
                collapsed ? "justify-center px-2" : ""
              )}
              title={collapsed ? "Admin Panel" : undefined}
            >
              <Shield className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </Link>
          )}
          {role !== "creator" && (
            <button
              onClick={() => handleRoleSwitch("creator")}
              disabled={switching}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors disabled:opacity-50",
                collapsed ? "justify-center px-2" : ""
              )}
              title={collapsed ? "Switch to Creator" : undefined}
            >
              {switching ? <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin" /> : <Palette className="h-[18px] w-[18px] shrink-0" />}
              {!collapsed && <span>{switching ? "Switching…" : "Switch to Creator"}</span>}
            </button>
          )}
          {role !== "brand" && (
            <button
              onClick={() => handleRoleSwitch("brand")}
              disabled={switching}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors disabled:opacity-50",
                collapsed ? "justify-center px-2" : ""
              )}
              title={collapsed ? "Switch to Brand" : undefined}
            >
              {switching ? <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin" /> : <Building2 className="h-[18px] w-[18px] shrink-0" />}
              {!collapsed && <span>{switching ? "Switching…" : "Switch to Brand"}</span>}
            </button>
          )}
          <a
            href="mailto:support@townshub.com"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors",
              collapsed ? "justify-center px-2" : ""
            )}
            title={collapsed ? "Support" : undefined}
          >
            <HelpCircle className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Support</span>}
          </a>
          <button
            onClick={signOut}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors",
              collapsed ? "justify-center px-2" : ""
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-7 h-6 w-6 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-muted"
        >
          <ChevronLeft className={cn("h-3 w-3 transition-transform", collapsed && "rotate-180")} />
        </button>
      </aside>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 pb-16 lg:pb-0",
        collapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card/80 backdrop-blur-sm px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1 rounded-md hover:bg-muted"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Show logo on mobile top bar */}
          <div className="lg:hidden flex-1">
            <LogoHorizontal />
          </div>
          <div className="hidden lg:block flex-1" />

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

      {/* Mobile bottom navigation bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-card border-t flex items-center"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== `/${role === "brand" ? "dashboard" : role}` && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          )
        })}
        {/* "More" button opens full sidebar */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] leading-none">More</span>
        </button>
      </nav>
    </div>
  )
}
