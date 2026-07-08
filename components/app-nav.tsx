"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Home, List, Plus, X } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/overview", label: "Overview" },
  { href: "/upload", label: "Upload" },
  { href: "/transactions", label: "Transactions" },
  { href: "/budgets", label: "Budgets" },
  { href: "/settings", label: "Settings" },
]

export function AppNav() {
  const pathname = usePathname()
  const [isListOpen, setIsListOpen] = useState(false)

  useEffect(() => {
    if (!isListOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsListOpen(false)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isListOpen])

  return (
    <>
      <header className="sticky top-0 z-40 hidden h-14 border-b bg-background/95 backdrop-blur md:block">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-6">
          <div className="text-lg font-semibold">Budget Bug</div>
          <nav
            aria-label="Primary navigation"
            className="flex items-center gap-1"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-3 border-t bg-background/95 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <Link
          href="/overview"
          aria-current={pathname === "/overview" ? "page" : undefined}
          className={cn(
            "flex min-w-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
            pathname === "/overview" && "text-foreground"
          )}
        >
          <Home className="size-5" aria-hidden="true" />
          <span className="sr-only">Overview</span>
        </Link>
        <Link
          href="/upload"
          aria-current={pathname === "/upload" ? "page" : undefined}
          className={cn(
            "flex min-w-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
            pathname === "/upload" && "text-foreground"
          )}
        >
          <Plus className="size-6" aria-hidden="true" />
          <span className="sr-only">Upload</span>
        </Link>
        <button
          type="button"
          aria-label="Open all navigation links"
          aria-expanded={isListOpen}
          onClick={() => setIsListOpen(true)}
          className="flex min-w-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <List className="size-5" aria-hidden="true" />
        </button>
      </nav>

      {isListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-6 text-white md:hidden">
          <button
            type="button"
            aria-label="Close navigation links"
            onClick={() => setIsListOpen(false)}
            className="absolute top-5 right-5 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
          <nav aria-label="All navigation links">
            <ul className="flex flex-col items-center gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsListOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "text-3xl font-semibold text-white/70 transition-colors hover:text-white",
                      pathname === item.href && "text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
