"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/lib/user-context"
import { 
  ArrowLeft, 
  Download, 
  FileText,
  AlertTriangle,
  Lightbulb,
  Target,
  BookOpen,
  DollarSign,
  Crown,
  CheckCircle2,
  XCircle
} from "lucide-react"
import type { AnalysisResult } from "@/lib/types"
import { UpgradeModal } from "@/components/upgrade-modal"

function ScoreRing({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 80) return "text-green-500"
    if (s >= 60) return "text-yellow-500"
    if (s >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getBgColor = (s: number) => {
    if (s >= 80) return "bg-green-500/20"
    if (s >= 60) return "bg-yellow-500/20"
    if (s >= 40) return "bg-orange-500/20"
    return "bg-red-500/20"
  }

  return (
    <div className={`relative w-32 h-32 rounded-full ${getBgColor(score)} flex items-center justify-center`}>
      <div className="text-center">
        <span className={`text-4xl font-bold ${getColor(score)}`}>{score}</span>
        <p className="text-xs text-muted-foreground mt-1">de 100</p>
      </div>
    </div>
  )
}

function CategoryCard({ 
  title, 
  puntos, 
  comentario, 
  icon: Icon 
}: { 
  title: string
  puntos: number
  comentario: string
  icon: React.ComponentType<{ className?: string }>
}) {
  const percentage = (puntos / 25) * 100
  
  return (
    <Card className="p-4 bg-card border-border">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-foreground">{title}</h3>
            <span className="text-sm font-semibold text-foreground">{puntos}/25</span>
          </div>
          <Progress value={percentage} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">{comentario}</p>
        </div>
      </div>
    </Card>
  )
}

export default function ResultPage() {
  const { isPro } = useUser()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)

  useEffect(() => {
    // Load result from sessionStorage
    const stored = sessionStorage.getItem('lastAnalysis')
    if (stored) {
      setResult(JSON.parse(stored))
    }
  }, [])

  const handleDownloadPDF = () => {
    if (!result) return
    
    // Create a simple text report for download
    const reportContent = generateReport(result, isPro)
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PowerCV-Analisis-${result.fileName.replace(/\.[^/.]+$/, '')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!result) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <Card className="p-8 bg-card border-border text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No hay resultados para mostrar
          </h2>
          <p className="text-muted-foreground mb-6">
            Analizá tu CV primero para ver los resultados
          </p>
          <Link href="/app/analizar">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Analizar CV
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/app">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Resultado del análisis
          </h1>
          <p className="text-muted-foreground text-sm">
            {result.fileName} - {result.jobTarget}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Score Overview */}
        <Card className="p-6 bg-card border-border">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={result.scoreTotal} />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Score ATS
              </h2>
              <p className="text-muted-foreground">{result.resumen}</p>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <div className="grid sm:grid-cols-2 gap-4">
          <CategoryCard
            title="Formato ATS"
            puntos={result.categorias.formato_ats.puntos}
            comentario={result.categorias.formato_ats.comentario}
            icon={FileText}
          />
          <CategoryCard
            title="Palabras Clave"
            puntos={result.categorias.palabras_clave.puntos}
            comentario={result.categorias.palabras_clave.comentario}
            icon={Target}
          />
          <CategoryCard
            title="Secciones"
            puntos={result.categorias.secciones.puntos}
            comentario={result.categorias.secciones.comentario}
            icon={BookOpen}
          />
          <CategoryCard
            title="Claridad"
            puntos={result.categorias.claridad.puntos}
            comentario={result.categorias.claridad.comentario}
            icon={CheckCircle2}
          />
        </div>

        {/* Problems */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Problemas detectados
          </h3>
          <ul className="space-y-3">
            {result.problemas.map((problema, index) => (
              <li key={index} className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{problema}</span>
              </li>
            ))}
          </ul>
          {!isPro && result.problemas.length >= 3 && (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Crown className="w-4 h-4" />
              Ver todos los problemas con Pro
            </button>
          )}
        </Card>

        {/* Suggestions */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Sugerencias de mejora
          </h3>
          <ul className="space-y-3">
            {result.sugerencias.map((sugerencia, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{sugerencia}</span>
              </li>
            ))}
          </ul>
          {!isPro && result.sugerencias.length >= 3 && (
            <button
              onClick={() => setUpgradeModalOpen(true)}
              className="mt-4 text-sm text-primary hover:underline flex items-center gap-1"
            >
              <Crown className="w-4 h-4" />
              Ver todas las sugerencias con Pro
            </button>
          )}
        </Card>

        {/* Pro Features */}
        {isPro && result.rangos_salariales && (
          <Card className="p-6 bg-card border-primary/30">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Rangos salariales estimados
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Pro
              </span>
            </h3>
            <p className="text-foreground">{result.rangos_salariales}</p>
          </Card>
        )}

        {isPro && result.cursos_recomendados && result.cursos_recomendados.length > 0 && (
          <Card className="p-6 bg-card border-primary/30">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Cursos recomendados
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Pro
              </span>
            </h3>
            <ul className="space-y-2">
              {result.cursos_recomendados.map((curso, index) => (
                <li key={index} className="flex items-center gap-2 text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  {curso}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {!isPro && (
          <Card className="p-6 bg-primary/5 border-primary/30">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Crown className="w-12 h-12 text-primary" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Desbloqueá más insights con Pro
                </h3>
                <p className="text-muted-foreground text-sm">
                  Accedé a rangos salariales, cursos recomendados, historial completo y más.
                </p>
              </div>
              <Button
                onClick={() => setUpgradeModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Crown className="w-4 h-4 mr-2" />
                Activar Pro
              </Button>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex-1 border-border text-foreground hover:bg-muted min-h-[48px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar reporte
          </Button>
          <Link href="/app/analizar" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[48px]">
              Analizar otro CV
            </Button>
          </Link>
        </div>
      </div>

      <UpgradeModal open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen} />
    </div>
  )
}

function generateReport(result: AnalysisResult, isPro: boolean): string {
  let report = `
╔════════════════════════════════════════════════════════════════╗
║                      POWERCV - ANÁLISIS ATS                      ║
╚════════════════════════════════════════════════════════════════╝

Archivo: ${result.fileName}
Puesto objetivo: ${result.jobTarget}
Fecha: ${new Date(result.createdAt).toLocaleDateString('es-AR')}

═══════════════════════════════════════════════════════════════════
                           SCORE TOTAL: ${result.scoreTotal}/100
═══════════════════════════════════════════════════════════════════

${result.resumen}

───────────────────────────────────────────────────────────────────
                         ANÁLISIS POR CATEGORÍA
───────────────────────────────────────────────────────────────────

📄 FORMATO ATS: ${result.categorias.formato_ats.puntos}/25
${result.categorias.formato_ats.comentario}

🎯 PALABRAS CLAVE: ${result.categorias.palabras_clave.puntos}/25
${result.categorias.palabras_clave.comentario}

📑 SECCIONES: ${result.categorias.secciones.puntos}/25
${result.categorias.secciones.comentario}

✨ CLARIDAD: ${result.categorias.claridad.puntos}/25
${result.categorias.claridad.comentario}

───────────────────────────────────────────────────────────────────
                         PROBLEMAS DETECTADOS
───────────────────────────────────────────────────────────────────

${result.problemas.map((p, i) => `${i + 1}. ${p}`).join('\n')}

───────────────────────────────────────────────────────────────────
                        SUGERENCIAS DE MEJORA
───────────────────────────────────────────────────────────────────

${result.sugerencias.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`

  if (isPro && result.rangos_salariales) {
    report += `
───────────────────────────────────────────────────────────────────
                    RANGOS SALARIALES ESTIMADOS (PRO)
───────────────────────────────────────────────────────────────────

${result.rangos_salariales}
`
  }

  if (isPro && result.cursos_recomendados?.length) {
    report += `
───────────────────────────────────────────────────────────────────
                      CURSOS RECOMENDADOS (PRO)
───────────────────────────────────────────────────────────────────

${result.cursos_recomendados.map((c, i) => `${i + 1}. ${c}`).join('\n')}
`
  }

  report += `
═══════════════════════════════════════════════════════════════════
                    Generado por PowerCV
                    https://powercv.app
═══════════════════════════════════════════════════════════════════
`

  return report
}
