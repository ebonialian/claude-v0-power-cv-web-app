"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Crown, 
  Lock,
  ExternalLink
} from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"
import type { Resource } from "@/lib/types"

const resources: Resource[] = [
  {
    id: "1",
    title: "Guía completa: Cómo crear un CV optimizado para ATS",
    description: "Todo lo que necesitás saber para que tu CV pase los filtros automáticos de las empresas.",
    type: "guide",
    url: "#",
    isPro: false
  },
  {
    id: "2",
    title: "Plantilla CV ATS-Friendly",
    description: "Plantilla descargable optimizada para sistemas ATS con formato limpio y profesional.",
    type: "pdf",
    url: "#",
    isPro: false
  },
  {
    id: "3",
    title: "Las 100 palabras clave más usadas por rubro",
    description: "Lista de keywords por industria para incluir en tu CV según tu área profesional.",
    type: "pdf",
    url: "#",
    isPro: false
  },
  {
    id: "4",
    title: "Errores fatales en CVs - Checklist",
    description: "Los 10 errores más comunes que hacen que los reclutadores descarten tu CV inmediatamente.",
    type: "guide",
    url: "#",
    isPro: false
  },
  {
    id: "5",
    title: "Guía avanzada: Optimización por sector",
    description: "Estrategias específicas de CV para tech, marketing, ventas, finanzas y más.",
    type: "pdf",
    url: "#",
    isPro: true
  },
  {
    id: "6",
    title: "Rangos salariales Argentina 2025",
    description: "Informe completo con rangos salariales actualizados por puesto y experiencia.",
    type: "pdf",
    url: "#",
    isPro: true
  },
  {
    id: "7",
    title: "Cómo negociar tu salario",
    description: "Guía práctica con scripts y técnicas para negociar tu compensación.",
    type: "guide",
    url: "#",
    isPro: true
  },
  {
    id: "8",
    title: "LinkedIn para profesionales IT",
    description: "Optimizá tu perfil de LinkedIn para atraer reclutadores tech.",
    type: "guide",
    url: "#",
    isPro: true
  },
  {
    id: "9",
    title: "Preparación para entrevistas técnicas",
    description: "Guía completa para prepararte para entrevistas técnicas en empresas tech.",
    type: "pdf",
    url: "#",
    isPro: true
  },
  {
    id: "10",
    title: "Portfolio profesional - Mejores prácticas",
    description: "Cómo crear un portfolio que complemente tu CV y destaque tu trabajo.",
    type: "guide",
    url: "#",
    isPro: true
  }
]

function ResourceIcon({ type }: { type: Resource['type'] }) {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5" />
    case 'video':
      return <Video className="w-5 h-5" />
    default:
      return <BookOpen className="w-5 h-5" />
  }
}

function ResourceCard({ 
  resource, 
  isPro, 
  onUpgradeClick 
}: { 
  resource: Resource
  isPro: boolean
  onUpgradeClick: () => void 
}) {
  const isLocked = resource.isPro && !isPro

  return (
    <Card className={`p-5 bg-card border-border transition-colors ${!isLocked ? 'hover:border-primary/50' : ''}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isLocked ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'
        }`}>
          <ResourceIcon type={resource.type} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-medium ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
              {resource.title}
            </h3>
            {resource.isPro && (
              <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-medium flex-shrink-0">
                Pro
              </span>
            )}
          </div>
          <p className={`text-sm mb-4 ${isLocked ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {resource.description}
          </p>
          
          {isLocked ? (
            <Button
              onClick={onUpgradeClick}
              variant="outline"
              size="sm"
              className="border-secondary/50 text-secondary hover:bg-secondary/10"
            >
              <Lock className="w-4 h-4 mr-2" />
              Desbloquear con Pro
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              {resource.type === 'pdf' ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver recurso
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function RecursosPage() {
  const { isPro } = useUser()
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'free' | 'pro'>('all')

  const filteredResources = resources.filter(r => {
    if (filter === 'free') return !r.isPro
    if (filter === 'pro') return r.isPro
    return true
  })

  const freeCount = resources.filter(r => !r.isPro).length
  const proCount = resources.filter(r => r.isPro).length

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Recursos
        </h1>
        <p className="text-muted-foreground">
          Guías, plantillas y recursos para potenciar tu búsqueda laboral
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' 
            ? 'bg-primary text-primary-foreground' 
            : 'border-border text-foreground hover:bg-muted'
          }
        >
          Todos ({resources.length})
        </Button>
        <Button
          variant={filter === 'free' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('free')}
          className={filter === 'free' 
            ? 'bg-primary text-primary-foreground' 
            : 'border-border text-foreground hover:bg-muted'
          }
        >
          Gratis ({freeCount})
        </Button>
        <Button
          variant={filter === 'pro' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pro')}
          className={filter === 'pro' 
            ? 'bg-secondary text-secondary-foreground' 
            : 'border-border text-foreground hover:bg-muted'
          }
        >
          <Crown className="w-4 h-4 mr-1" />
          Pro ({proCount})
        </Button>
      </div>

      {/* Pro Banner */}
      {!isPro && (
        <Card className="p-4 sm:p-6 bg-secondary/10 border-secondary/30 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Crown className="w-10 h-10 text-secondary" />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                Accedé a todos los recursos con Pro
              </h3>
              <p className="text-muted-foreground text-sm">
                Desbloqueá {proCount} recursos exclusivos con guías avanzadas y plantillas premium.
              </p>
            </div>
            <Button
              onClick={() => setUpgradeModalOpen(true)}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Crown className="w-4 h-4 mr-2" />
              Activar Pro
            </Button>
          </div>
        </Card>
      )}

      {/* Resources Grid */}
      <div className="grid gap-4">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isPro={isPro}
            onUpgradeClick={() => setUpgradeModalOpen(true)}
          />
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="mt-8 p-6 bg-muted/50 border-border text-center">
        <Video className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          Videos en camino
        </h3>
        <p className="text-muted-foreground text-sm">
          Pronto vamos a agregar video tutoriales y workshops en vivo. Mantenete atento.
        </p>
      </Card>

      <UpgradeModal open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen} />
    </div>
  )
}
