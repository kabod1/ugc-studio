"use client"

import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/shared/user-menu"
import { NotificationBell } from "@/components/shared/notification-bell"
import { SearchInput } from "@/components/shared/search-input"

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SearchInput
          value=""
          onChange={() => {}}
          placeholder="Search..."
        />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  )
}
