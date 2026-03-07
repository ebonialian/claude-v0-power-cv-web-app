"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import { 
  History, 
  FileText, 
  Crown, 
  Calendar,
  Target,
  TrendingUp,
  Lock
} from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"

function ScoreBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-green-500/20 text-green-500"
    if (s >= 60) return "bg-yellow-500/20 text-yellow-500"
    if (s >= 40) return "bg-orange-500/20 text-orange-500"
    return "bg-red-500/20 text-red-500"
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getColor(score)}`}>
      {score}/100
    </span>
  )
}

export default function HistorialPage() {
  const { isPro, analyses, userProfile } = useUser()
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  if (!isPro) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Historial de análisis
          </h1>
          <p className="text-muted-foreground">
            Accedé a tu historial completo y perfil acumulativo
          </p>
        </div>

        <Card className="p-8 bg-card border-border text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Función exclusiva Pro
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Con el plan Pro podés guardar y acceder a todo tu historial de análisis, 
            ver tu evolución y recibir feedback cada vez más personalizado.
          </p>
          <Button
            onClick={() => setUpgradeModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Crown className="w-4 h-4 mr-2" />
            Activar Pro
          </Button>
        </Card>

        <UpgradeModal open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Historial de análisis
        </h1>
        <p className="text-muted-foreground">
          Tu evolución y análisis anteriores
        </p>
      </div>

      {/* Profile Stats */}
      {userProfile && userProfile.totalAnalyses > 0 && (
        <Card className="p-6 bg-card border-primary/30 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Tu perfil acumulativo
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{userProfile.totalAnalyses}</p>
              <p className="text-sm text-muted-foreground">Análisis</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">{userProfile.scorePromedio}</p>
              <p className="text-sm text-muted-foreground">Score promedio</p>
            </div>
            {userProfile.rubroPrincipal && (
              <div className="text-center p-4 rounded-lg bg-muted col-span-2">
                <p className="text-lg font-semibold text-foreground">{userProfile.rubroPrincipal}</p>
                <p className="text-sm text-muted-foreground">Rubro principal</p>
              </div>
            )}
          </div>
          {userProfile.notasIA && (
            <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Notas de la IA sobre tu perfil:</p>
              <p className="text-foreground">{userProfile.notasIA}</p>
            </div>
          )}
        </Card>
      )}

      {/* Analysis List */}
      {analyses.length === 0 ? (
        <Card className="p-8 bg-card border-border text-center">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No tenés análisis guardados
          </h2>
          <p className="text-muted-foreground mb-6">
            Analizá tu primer CV para empezar a construir tu historial
          </p>
          <Link href="/app">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Analizar CV
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Card 
              key={analysis.id} 
              className="p-4 sm:p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => {
                sessionStorage.setItem('lastAnalysis', JSON.stringify(analysis))
                window.location.href = `/app/resultado/${analysis.id}`
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{analysis.fileName}</h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {analysis.jobTarget}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(analysis.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>

                <ScoreBadge score={analysis.scoreTotal} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
