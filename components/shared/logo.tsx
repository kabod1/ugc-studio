import Image from "next/image"

// Full square logo (icon + "TOWNSHUB LIMITED" text stacked) — use on auth pages
export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/branding materials/TRANS TH LOGO VARIATION COL 1.png"
      alt="UGC Studio by Townshub Limited"
      width={120}
      height={120}
      className={`object-contain ${className}`}
      priority
    />
  )
}

// TH icon only, navy — use on light backgrounds (collapsed sidebar)
export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/branding materials/TRANS TH LOGO ICON COL 1.png"
      alt="UGC Studio"
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
      priority
    />
  )
}

// Icon + "UGC Studio" text row — use in expanded sidebar & nav bars
export function LogoHorizontal({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={32} />
      <span className="font-bold text-lg whitespace-nowrap">UGC Studio</span>
    </span>
  )
}
