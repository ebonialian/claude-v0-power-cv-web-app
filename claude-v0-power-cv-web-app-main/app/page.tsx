"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  FileText, 
  Zap, 
  Target, 
  TrendingUp, 
  Check, 
  ArrowRight,
  Menu,
  X,
  Users,
  BarChart3,
  FileCheck,
  Sparkles,
  DollarSign,
  GraduationCap
} from "lucide-react"

function AnimatedScore() {
  const [score, setScore] = useState(0)
  const targetScore = 87

  useEffect(() => {
    const timer = setTimeout(() => {
      if (score < targetScore) {
        setScore(prev => Math.min(prev + 2, targetScore))
      }
    }, 30)
    return () => clearTimeout(timer)
  }, [score])

  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="#2563eb"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground">Score ATS</span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const stats = [
    { value: "+5,000", label: "CVs analizados" },
    { value: "87%", label: "mejora promedio" },
    { value: "30 seg", label: "tiempo de análisis" },
    { value: "4.9/5", label: "satisfacción" },
  ]

  const features = [
    {
      number: "01",
      icon: BarChart3,
      title: "Score ATS detallado",
      description: "Puntaje de 0 a 100 que indica qué tan compatible es tu CV con los sistemas de filtrado automático."
    },
    {
      number: "02",
      icon: Target,
      title: "Análisis de keywords",
      description: "Identificamos las palabras clave que faltan según el puesto al que aplicás."
    },
    {
      number: "03",
      icon: FileCheck,
      title: "Formato óptimo",
      description: "Verificamos que la estructura de tu CV sea legible por los sistemas ATS."
    },
    {
      number: "04",
      icon: Sparkles,
      title: "Sugerencias con IA",
      description: "Recomendaciones personalizadas generadas por inteligencia artificial."
    },
    {
      number: "05",
      icon: DollarSign,
      title: "Rangos salariales",
      description: "Conocé cuánto se paga en el mercado para tu perfil y experiencia."
    },
    {
      number: "06",
      icon: GraduationCap,
      title: "Cursos recomendados",
      description: "Sugerencias de capacitación para mejorar tu perfil profesional."
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">PowerCV</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Funcionalidades
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                Planes
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                FAQ
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground hover:bg-muted font-medium">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm">
                  Analizá tu CV gratis
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-foreground min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border">
            <div className="px-4 py-4 space-y-4">
              <Link 
                href="#features" 
                className="block text-muted-foreground hover:text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funcionalidades
              </Link>
              <Link 
                href="#pricing" 
                className="block text-muted-foreground hover:text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planes
              </Link>
              <Link 
                href="#faq" 
                className="block text-muted-foreground hover:text-foreground py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-4 border-t border-border space-y-3">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full text-foreground min-h-[48px]">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground min-h-[48px]">
                    Analizá tu CV gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - 2 Columns */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Text */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance mb-6">
                Tu CV merece llegar a la entrevista, no al descarte.
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                El 75% de los CVs son eliminados por filtros automáticos antes de que un humano los lea. Analizá tu CV con IA y mejorá tus chances de conseguir esa entrevista.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-8 min-h-[52px] shadow-md">
                    Analizá tu CV gratis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">
                Sin tarjeta de crédito. Resultados en 30 segundos.
              </p>
            </div>

            {/* Right Column - Score Preview Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="p-6 sm:p-8 bg-card border-border shadow-lg max-w-sm w-full">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Vista previa del análisis</p>
                  <div className="flex justify-center mb-4">
                    <AnimatedScore />
                  </div>
                  <p className="text-sm font-medium text-primary">Excelente compatibilidad ATS</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Formato</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-[90%] h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-foreground font-medium">23/25</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Keywords</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-[80%] h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-foreground font-medium">20/25</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Secciones</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-[88%] h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-foreground font-medium">22/25</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Claridad</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-[88%] h-full bg-primary rounded-full" />
                      </div>
                      <span className="text-foreground font-medium">22/25</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Strip */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Grid 6 items */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitás para destacar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nuestra IA analiza tu CV en profundidad y te da recomendaciones accionables.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.number} className="p-6 bg-card border-border hover:border-primary/30 hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{feature.number}</span>
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Navy Background */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-foreground mb-4">
              Elegí tu plan
            </h2>
            <p className="text-secondary-foreground/70 text-lg">
              Empezá gratis y pasá a Pro cuando quieras más poder
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-card border-border relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">$0</span>
                  <span className="text-muted-foreground">/siempre</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Análisis ilimitados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Score ATS detallado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">3 problemas principales</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">3 sugerencias básicas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">PDF básico descargable</span>
                </li>
              </ul>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted min-h-[48px] font-medium">
                  Empezar gratis
                </Button>
              </Link>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 bg-card border-2 border-primary relative overflow-hidden shadow-lg">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  Popular
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">$4.97</span>
                  <span className="text-muted-foreground">USD/mes</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Todo lo del plan Free</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Historial completo de análisis</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Perfil acumulativo con IA</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Comparación con ofertas laborales</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Rangos salariales del mercado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Cursos recomendados</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">PDF premium personalizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Recursos y guías completas</span>
                </li>
              </ul>

              <Link href="/login" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-h-[48px] shadow-md">
                  Activar Pro
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Qué es un sistema ATS?
              </h3>
              <p className="text-muted-foreground">
                ATS (Applicant Tracking System) es un software que usan las empresas para filtrar CVs automáticamente antes de que lleguen a un reclutador humano. Si tu CV no está optimizado, puede ser descartado sin que nadie lo lea.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Mis datos están seguros?
              </h3>
              <p className="text-muted-foreground">
                Sí, tu CV se procesa de forma segura y no almacenamos el contenido después del análisis en el plan Free. Con el plan Pro, guardamos tu historial para darte mejor feedback, pero nunca compartimos tus datos con terceros.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Qué formatos de CV aceptan?
              </h3>
              <p className="text-muted-foreground">
                Actualmente aceptamos archivos PDF y DOCX. Recomendamos PDF ya que mantiene mejor el formato original de tu CV.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Cómo funciona el perfil acumulativo?
              </h3>
              <p className="text-muted-foreground">
                Con el plan Pro, nuestra IA aprende de cada análisis que hacés. Identifica patrones recurrentes en tus CVs y te da sugerencias cada vez más personalizadas basadas en tu historial y objetivos profesionales.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ¿Puedo cancelar mi suscripción en cualquier momento?
              </h3>
              <p className="text-muted-foreground">
                Sí, podés cancelar tu suscripción Pro cuando quieras desde tu panel de cuenta. Mantenés acceso a las funciones Pro hasta el final del período facturado.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Empezá a optimizar tu CV hoy
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Más de 5000 profesionales en Argentina y Latam ya mejoraron sus CVs con PowerCV. Es gratis y te toma menos de un minuto.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-8 min-h-[52px] shadow-md">
              Analizá tu CV gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">PowerCV</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Términos</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contacto</Link>
            </div>

            <p className="text-sm text-muted-foreground">
              © 2026 PowerCV. Hecho con amor en Argentina.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
