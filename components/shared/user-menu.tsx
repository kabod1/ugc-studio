"use client"

import { useState } from "react"
import { useUser } from "@/hooks/use-user"
import { getInitials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, CreditCard, LogOut, Download } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { PWAInstallModal } from "@/components/shared/pwa-install-modal"

export function UserMenu() {
  const { profile, signOut } = useUser()
  const { canInstall, isStandalone, install } = usePWAInstall()
  const [showInstallModal, setShowInstallModal] = useState(false)

  if (!profile) return null

  const initials = profile.full_name
    ? getInitials(profile.full_name)
    : profile.email.slice(0, 2).toUpperCase()

  async function handleInstallClick() {
    if (canInstall) {
      const outcome = await install()
      if (outcome === "unavailable") setShowInstallModal(true)
    } else {
      setShowInstallModal(true)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage
                src={profile.avatar_url || undefined}
                alt={profile.full_name || "User"}
              />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {profile.full_name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile.email}
              </p>
              <Badge variant="secondary" className="mt-1 w-fit text-[10px]">
                {profile.role}
              </Badge>
            </div>
          </DropdownMenuLabel>

          {/* Install App — always shown when not already installed */}
          {!isStandalone && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleInstallClick}
              >
                <Download className="mr-2 h-4 w-4" />
                Install App
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => (window.location.href = "/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          {profile.role === "brand" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => (window.location.href = "/billing")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PWAInstallModal
        open={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        canNativeInstall={canInstall}
        onNativeInstall={async () => {
          await install()
          setShowInstallModal(false)
        }}
      />
    </>
  )
}
