"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/lib/user-context"
import { 
  Upload, 
  FileText, 
  Loader2, 
  Sparkles,
  Target,
  X
} from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

export default function AnalyzePage() {
  const { user, isPro, addAnalysis } = useUser()
  const router = useRouter()
  
  const [file, setFile] = useState<File | null>(null)
  const [jobTarget, setJobTarget] = useState("")
  const [ofertaLaboral, setOfertaLaboral] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx") || droppedFile.name.endsWith(".txt"))) {
      setFile(droppedFile)
      setError("")
    } else {
      setError("Solo aceptamos archivos PDF, DOCX o TXT")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".docx") || selectedFile.name.endsWith(".txt")) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("Solo aceptamos archivos PDF, DOCX o TXT")
      }
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError("Subí tu CV para analizarlo")
      return
    }
    if (!jobTarget.trim()) {
      setError("Indicá el puesto al que querés aplicar")
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('jobTarget', jobTarget)
      formData.append('isPro', String(isPro))
      if (ofertaLaboral) {
        formData.append('ofertaLaboral', ofertaLaboral)
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        headers: user
          ? {
              'x-user-id': user.id,
            }
          : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
throw new Error(errorData.error || 'Error al analizar el CV')
      }

      const result: AnalysisResult = await response.json()
      
      if (user && isPro) {
        addAnalysis(result)
      }

      sessionStorage.setItem('lastAnalysis', JSON.stringify(result))
      router.push(`/app/resultado/${result.id}`)
    } catch (err) {
      console.error('Analysis error:', err)
      setError("Error al analizar el CV. Intentá de nuevo.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Analizá tu CV
        </h1>
        <p className="text-muted-foreground">
          Subí tu CV y descubrí cómo mejorarlo para pasar los filtros ATS
        </p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
        <Card className="p-6 bg-card border-border">
          <Label className="text-foreground font-medium mb-4 block">
            Tu CV (PDF, DOCX o TXT)
          </Label>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
              ${dragActive 
                ? "border-primary bg-primary/5" 
                : file 
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }
            `}
          >
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setFile(null)
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-1">
                  Arrastrá tu CV acá o hacé click para subir
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, DOCX o TXT, máximo 10MB
                </p>
              </>
            )}
          </div>
        </Card>

        {/* Job Target */}
        <Card className="p-6 bg-card border-border">
          <Label htmlFor="jobTarget" className="text-foreground font-medium mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Puesto objetivo
          </Label>
          <Input
            id="jobTarget"
            placeholder="Ej: Desarrollador Full Stack, Marketing Manager, Analista de Datos..."
            value={jobTarget}
            onChange={(e) => setJobTarget(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[48px] text-base"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Indicá el tipo de puesto al que querés aplicar para un análisis más preciso
          </p>
        </Card>

        {/* Job Offer Comparison (Pro Feature) */}
        <Card className={`p-6 bg-card border-border ${!isPro ? 'opacity-70' : ''}`}>
          <Label htmlFor="ofertaLaboral" className="text-foreground font-medium mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Comparar con oferta laboral
            {!isPro && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                Pro
              </span>
            )}
          </Label>
          <Textarea
            id="ofertaLaboral"
            placeholder="Pegá acá el texto de la oferta laboral para que comparemos tu CV con los requisitos específicos..."
            value={ofertaLaboral}
            onChange={(e) => setOfertaLaboral(e.target.value)}
            disabled={!isPro}
            rows={4}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none text-base"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {isPro 
              ? "Analizamos qué tan bien tu CV matchea con los requisitos de la oferta"
              : "Activá Pro para comparar tu CV con ofertas laborales específicas"
            }
          </p>
        </Card>

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !file}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-h-[56px] text-lg shadow-md"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analizando tu CV...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Analizar CV con IA
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>El análisis tarda aproximadamente 30 segundos</p>
        </div>
      </div>
    </div>
  )
}
