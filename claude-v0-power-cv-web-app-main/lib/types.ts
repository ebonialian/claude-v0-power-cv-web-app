export type Plan = 'free' | 'pro'

export interface User {
  id: string
  email: string
  fullName: string
  plan: Plan
  createdAt: string
  lemonsqueezyRenewsAt?: string | null
  lemonsqueezyManageUrl?: string | null
}

export interface AnalysisCategory {
  puntos: number
  comentario: string
}

export interface AnalysisResult {
  id: string
  userId?: string
  createdAt: string
  jobTarget: string
  fileName: string
  scoreTotal: number
  categorias: {
    formato_ats: AnalysisCategory
    palabras_clave: AnalysisCategory
    secciones: AnalysisCategory
    claridad: AnalysisCategory
  }
  problemas: string[]
  sugerencias: string[]
  resumen: string
  rangos_salariales?: string
  cursos_recomendados?: string[]
  ofertaLaboralTexto?: string
}

export interface UserProfile {
  userId: string
  rubroPrincipal?: string
  objetivoProfesional?: string
  habilidadesDetectadas: string[]
  problemasRecurrentes: string[]
  scorePromedio: number
  totalAnalyses: number
  notasIA?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'guide' | 'video'
  url: string
  isPro: boolean
}
