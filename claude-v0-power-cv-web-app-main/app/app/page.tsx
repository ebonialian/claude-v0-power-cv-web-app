"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { getBrowserSupabaseClient } from "@/lib/supabase/client"
import { 
  FileText, 
  Upload, 
  History, 
  TrendingUp, 
  ArrowRight,
  Crown
} from "lucide-react"

interface DashboardAnalysisSummary {
  id: string
  createdAt: string
  jobTarget: string
  scoreTotal: number
}

export default function DashboardPage() {
  const { user, isPro } = useUser()
  const [analyses, setAnalyses] = useState<DashboardAnalysisSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      const supabase = getBrowserSupabaseClient()
      try {
        const { data, error } = await supabase
          .from("analyses")
          .select("id, created_at, job_target, score_total")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error al cargar análisis para el dashboard:", error)
          setIsLoading(false)
          return
        }

        const mapped: DashboardAnalysisSummary[] = (data || []).map((row: any) => ({
          id: row.id,
          createdAt: row.created_at,
          jobTarget: row.job_target,
          scoreTotal: row.score_total,
        }))

        setAnalyses(mapped)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  const lastAnalysis = analyses.length > 0 ? analyses[0] : null

  const analysesThisMonth = analyses.filter((a) => {
    const d = new Date(a.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {user ? `Hola, ${user.fullName.split(' ')[0]}` : 'Bienvenido a PowerCV'}
        </h1>
        <p className="text-muted-foreground">
          {isPro 
            ? 'Optimizá tu CV con todas las funciones Pro' 
            : 'Analizá y mejorá tu CV para destacar en los procesos de selección'
          }
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Primary CTA - Analyze */}
        <Link href="/app/analizar" className="sm:col-span-2 lg:col-span-1">
          <Card className="p-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors h-full cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Analizar CV</h3>
            <p className="text-primary-foreground/80 text-sm">
              Subí tu CV y obtené un análisis detallado con IA
            </p>
          </Card>
        </Link>

        {/* History */}
        <Link href="/app/historial">
          <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors h-full cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <History className="w-6 h-6 text-foreground" />
              </div>
              {!isPro && (
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Pro
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Historial</h3>
            <p className="text-muted-foreground text-sm">
              {isPro 
                ? `${totalAnalyses} análisis realizados`
                : 'Activá Pro para ver tu historial'
              }
            </p>
          </Card>
        </Link>

        {/* Resources */}
        <Link href="/app/recursos">
          <Card className="p-6 bg-card border-border hover:border-primary/30 transition-colors h-full cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Recursos</h3>
            <p className="text-muted-foreground text-sm">
              Guías y plantillas para mejorar tu CV
            </p>
          </Card>
        </Link>
      </div>

      {/* Stats / Last Analysis */}
      {user && isPro && lastAnalysis && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tu último análisis</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-1">Score</p>
              <p className="text-2xl font-bold text-primary">{lastAnalysis.scoreTotal}/100</p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-1">Fecha</p>
              <p className="text-base font-medium text-foreground">
                {new Date(lastAnalysis.createdAt).toLocaleDateString("es-AR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Card>
            <Card className="p-4 bg-card border-border">
              <p className="text-sm text-muted-foreground mb-1">Puesto</p>
              <p className="text-base font-medium text-foreground truncate">
                {lastAnalysis.jobTarget}
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Pro Upsell for Free Users */}
      {user && !isPro && (
        <Card className="p-6 bg-secondary text-secondary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary-foreground/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Pasá a Pro</h3>
                <p className="text-secondary-foreground/80 text-sm">
                  Desbloqueá historial, rangos salariales, cursos recomendados y más.
                </p>
              </div>
            </div>
            <Link href="/app/cuenta">
              <Button className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90 font-semibold min-h-[44px] whitespace-nowrap">
                Ver planes
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Tips Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tips para un mejor score</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="p-4 bg-card border-border">
            <h3 className="font-medium text-foreground mb-2">Usá palabras clave</h3>
            <p className="text-sm text-muted-foreground">
              Incluí términos específicos del puesto al que aplicás. Los ATS buscan keywords exactas.
            </p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <h3 className="font-medium text-foreground mb-2">Formato simple</h3>
            <p className="text-sm text-muted-foreground">
              Evitá tablas, columnas y gráficos. Los ATS prefieren texto plano y estructura clara.
            </p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <h3 className="font-medium text-foreground mb-2">Cuantificá logros</h3>
            <p className="text-sm text-muted-foreground">
              Usá números y métricas. "Aumenté ventas 30%" es mejor que "Aumenté ventas".
            </p>
          </Card>
          <Card className="p-4 bg-card border-border">
            <h3 className="font-medium text-foreground mb-2">Personalizá cada CV</h3>
            <p className="text-sm text-muted-foreground">
              Adaptá tu CV a cada oferta. Un CV genérico tiene menos chances de pasar los filtros.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
