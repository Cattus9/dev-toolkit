"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface LayoutProps {
  children: ReactNode;
}

export function Shell({ children }: LayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <span className="font-sans font-bold tracking-tight text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ToolKit
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Landing Page
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            {!isDashboard && (
              <Link
                href="/dashboard?add=true"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/10 hover:bg-primary/90 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
              >
                Add Tool
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ToolKit. Made with &hearts; for personal tool management.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Powered by Next.js & Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
