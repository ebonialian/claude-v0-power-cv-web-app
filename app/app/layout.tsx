"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { UserProvider, useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  LayoutDashboard, 
  History, 
  BookOpen, 
  User, 
  Menu, 
  X,
  LogOut,
  Crown
} from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"

const navItems = [
  { href: "/app", label: "Analizar", icon: LayoutDashboard },
  { href: "/app/historial", label: "Historial", icon: History },
  { href: "/app/recursos", label: "Recursos", icon: BookOpen },
  { href: "/app/cuenta", label: "Cuenta", icon: User },
]

function DashboardContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { user, isPro, logout } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">PowerCV</span>
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="bg-card border-b border-border px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
            
            {!isPro && (
              <Button
                onClick={() => {
                  setUpgradeModalOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground mt-4"
              >
                <Crown className="w-4 h-4 mr-2" />
                Activar Pro
              </Button>
            )}
            
            {user && (
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full text-muted-foreground hover:text-foreground mt-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            )}
          </nav>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <Link href="/app" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-sidebar-foreground">PowerCV</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 space-y-3">
          {!isPro && (
            <Button
              onClick={() => setUpgradeModalOpen(true)}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Crown className="w-4 h-4 mr-2" />
              Activar Pro
            </Button>
          )}
          
          {user ? (
            <div className="px-4 py-3 rounded-lg bg-sidebar-accent">
              <p className="text-sm text-sidebar-foreground font-medium truncate">
                {user.fullName}
              </p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {user.email}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full mt-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="w-full border-sidebar-border text-sidebar-foreground">
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>

      <UpgradeModal open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen} />
    </div>
  )
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserProvider>
  )
}
