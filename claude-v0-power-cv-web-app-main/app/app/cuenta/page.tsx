"use client"

import { useState, Suspense } from "react"
```

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"
import { 
  User, 
  Mail, 
  Crown, 
  Calendar,
  LogIn,
  Check,
  Settings
} from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"

export default function CuentaPage() {
  const { user, isPro, userProfile, logout } = useUser()
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const router = useRouter()

  const handleStartProCheckout = async () => {
    if (!user) return

    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        console.error("Error al iniciar checkout:", data)
        alert("No pudimos iniciar el pago. Probá de nuevo en unos minutos.")
        return
      }

      const data = await res.json()
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert("No recibimos la URL de pago. Probá de nuevo.")
      }
    } catch (error) {
      console.error("Error al iniciar checkout:", error)
      alert("Ocurrió un error al iniciar el pago. Probá de nuevo.")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Mi cuenta
          </h1>
          <p className="text-muted-foreground">
            Iniciá sesión para acceder a tu cuenta
          </p>
        </div>

        <Card className="p-8 bg-card border-border text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No iniciaste sesión
          </h2>
          <p className="text-muted-foreground mb-6">
            Creá una cuenta o iniciá sesión para guardar tu progreso y acceder a más funciones.
          </p>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar sesión
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Mi cuenta
        </h1>
        <p className="text-muted-foreground">
          Gestioná tu perfil y suscripción
        </p>
      </div>

      <div className="space-y-6">
        {/* Plan Card */}
        <Card className={`p-6 ${isPro ? 'bg-primary/5 border-primary/30' : 'bg-card border-border'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isPro ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <Crown className={`w-6 h-6 ${isPro ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Plan {isPro ? 'Pro' : 'Free'}
                </h2>
                {isPro ? (
                  <>
                    <p className="text-muted-foreground text-sm">
                      Tenés acceso a todas las funcionalidades premium.
                    </p>
                    {user.lemonsqueezyRenewsAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Próxima renovación:{" "}
                        {new Date(user.lemonsqueezyRenewsAt).toLocaleDateString("es-AR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Actualizá a Pro para desbloquear más funciones.
                  </p>
                )}
              </div>
            </div>
            
            {!isPro ? (
              <Button
                onClick={handleStartProCheckout}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Crown className="w-4 h-4 mr-2" />
                Activar Pro por USD $4.97/mes
              </Button>
            ) : (
              user.lemonsqueezyManageUrl && (
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => {
                    window.open(user.lemonsqueezyManageUrl ?? "#", "_blank")
                  }}
                >
                  Gestionar suscripción
                </Button>
              )
            )}
          </div>

          {isPro && (
            <div className="mt-6 pt-6 border-t border-primary/20">
              <h3 className="font-medium text-foreground mb-3">Beneficios activos:</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Historial completo
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Perfil acumulativo IA
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Rangos salariales
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Cursos recomendados
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  Recursos premium
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  PDF completo
                </li>
              </ul>
              
              {user.lemonsqueezyManageUrl && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Podés gestionar tu suscripción (método de pago, cancelación, etc.) desde el portal de Lemon Squeezy.
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Profile Info */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Información personal
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Nombre completo</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{user.fullName}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Email</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">{user.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Miembro desde</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground">
                  {new Date(user.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        {userProfile && userProfile.totalAnalyses > 0 && (
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Estadísticas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted text-center">
                <p className="text-2xl font-bold text-foreground">{userProfile.totalAnalyses}</p>
                <p className="text-sm text-muted-foreground">CVs analizados</p>
              </div>
              <div className="p-4 rounded-lg bg-muted text-center">
                <p className="text-2xl font-bold text-foreground">{userProfile.scorePromedio}</p>
                <p className="text-sm text-muted-foreground">Score promedio</p>
              </div>
            </div>
          </Card>
        )}

        {/* Objective */}
        {isPro && (
          <Card className="p-6 bg-card border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Objetivo profesional
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Definí tu objetivo para que la IA te dé recomendaciones más personalizadas.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rubroPrincipal" className="text-foreground">
                  Rubro o industria
                </Label>
                <Input
                  id="rubroPrincipal"
                  placeholder="Ej: Tecnología, Marketing, Finanzas..."
                  defaultValue={userProfile?.rubroPrincipal || ''}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[48px] text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objetivoProfesional" className="text-foreground">
                  Objetivo profesional
                </Label>
                <Input
                  id="objetivoProfesional"
                  placeholder="Ej: Conseguir mi primer trabajo en tech, Cambiar de industria..."
                  defaultValue={userProfile?.objetivoProfesional || ''}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[48px] text-base"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Guardar cambios
              </Button>
            </div>
          </Card>
        )}

        {/* Logout */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted"
            onClick={handleLogout}
          >
            <LogIn className="w-4 h-4 mr-2 rotate-180" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <UpgradeModal open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen} />
    </div>
  )
}
