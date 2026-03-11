"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, ArrowLeft, Loader2 } from "lucide-react"
import { getBrowserSupabaseClient } from "@/lib/supabase/client"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

const supabase = getBrowserSupabaseClient()

function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectAfterAuth = () => {
    const redirectedFrom = searchParams.get("redirectedFrom")
    router.push(redirectedFrom || "/app")
  }

  const mapLoginErrorToMessage = (message: string) => {
    const lower = message.toLowerCase()
    if (lower.includes("invalid login credentials") || lower.includes("invalid email or password")) {
      return "Email o contraseña incorrectos."
    }
    if (lower.includes("email not confirmed")) {
      return "Tenés que confirmar tu email antes de iniciar sesión."
    }
    return "No pudimos iniciar sesión. Probá de nuevo en unos minutos."
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setError(mapLoginErrorToMessage(signInError.message))
          return
        }
        redirectAfterAuth()
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })

        if (signUpError || !data.user) {
          setError("No pudimos crear tu cuenta. Revisá que el email no esté ya registrado.")
          return
        }

        await supabase.from("profiles").upsert(
          { id: data.user.id, email, full_name: fullName, plan: "free" },
          { onConflict: "id" }
        )

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setInfo("Te creamos la cuenta, pero no pudimos iniciar sesión automáticamente. Probá iniciar sesión de nuevo.")
          return
        }

        redirectAfterAuth()
      }
    } catch {
      setError("Ocurrió un error inesperado. Intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setInfo("")
    setIsLoading(true)
    try {
      const redirectTo = `${window.location.origin}/app`
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })
      if (oauthError) setError("Error Google: " + oauthError.message)
    } catch (e: any) {
      setError("Error catch: " + e?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    setError("")
    setInfo("")
    if (!email) { setError("Escribí tu email para recuperar la contraseña."); return }
    setIsLoading(true)
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (resetError) { setError("No pudimos enviar el mail de recuperación. Probá de nuevo en unos minutos."); return }
      setInfo("Te mandamos un mail para que restablezcas tu contraseña.")
    } catch {
      setError("No pudimos enviar el mail de recuperación. Probá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px]">
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-6 sm:p-8 bg-card border-border shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Iniciá sesión" : "Creá tu cuenta"}
            </h1>
            <p className="text-muted-foreground mt-2 text-center">
              {isLogin ? "Accedé a tu cuenta de PowerCV" : "Empezá a optimizar tu CV hoy"}
            </p>
          </div>

          <Button type="button" variant="outline" onClick={handleGoogleLogin}
            className="w-full border-border text-foreground hover:bg-muted min-h-[48px] mb-6 font-medium">
            <GoogleIcon className="w-5 h-5 mr-2" />
            Continuar con Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">o con email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Nombre completo</Label>
                <Input id="fullName" type="text" placeholder="Tu nombre" value={fullName}
                  onChange={(e) => setFullName(e.target.value)} required={!isLogin}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[48px] text-base" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input id="email" type="email" placeholder="tu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[48px] text-base" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">Contraseña</Label>
                {isLogin && (
                  <button type="button" className="text-sm text-primary hover:underline" onClick={handlePasswordReset}>
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[48px] text-base" />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
            {info && !error && <p className="text-sm text-foreground">{info}</p>}

            <Button type="submit" disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-h-[48px] shadow-sm">
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isLogin ? "Iniciando sesión..." : "Creando cuenta..."}</>
              ) : (isLogin ? "Iniciar sesión" : "Crear cuenta")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); setInfo("") }}
                className="text-primary hover:underline font-medium">
                {isLogin ? "Crear cuenta" : "Iniciar sesión"}
              </button>
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}