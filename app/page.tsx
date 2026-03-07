"use client"

import Link from "next/link"
import { useState } from "react"
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
  Star,
  Shield,
  Clock,
  BarChart3
} from "lucide-react"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">PowerCV</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Planes
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground hover:bg-muted">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/app">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Empezar gratis
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-foreground"
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
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Funcionalidades
              </Link>
              <Link 
                href="#pricing" 
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planes
              </Link>
              <Link 
                href="#faq" 
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-4 border-t border-border space-y-3">
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full text-foreground">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/app" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Empezar gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Optimización ATS con IA</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance mb-6">
            Tu CV pasando los filtros ATS de las empresas top
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Analizá tu CV con inteligencia artificial y recibí recomendaciones específicas para superar los sistemas de filtrado automático que usan los reclutadores en Argentina y Latam.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/app">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 min-h-[56px]">
                Analizar mi CV gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-muted text-lg px-8 py-6 min-h-[56px]">
                Ver cómo funciona
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Datos seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Resultados en 30 seg</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              <span>+5000 CVs analizados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitás para destacar
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Nuestra IA analiza tu CV en profundidad y te da recomendaciones accionables para mejorar tu tasa de respuesta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Score ATS</h3>
              <p className="text-muted-foreground">
                Obtené un puntaje detallado de 0 a 100 que refleja qué tan bien optimizado está tu CV para los sistemas ATS.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Palabras Clave</h3>
              <p className="text-muted-foreground">
                Identificamos las keywords que faltan en tu CV según el puesto al que aplicás y tu industria.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Formato Óptimo</h3>
              <p className="text-muted-foreground">
                Analizamos la estructura y formato de tu CV para asegurar que los ATS puedan leerlo correctamente.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Sugerencias IA</h3>
              <p className="text-muted-foreground">
                Recibí recomendaciones personalizadas generadas por IA para mejorar cada sección de tu CV.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Rangos Salariales</h3>
              <p className="text-muted-foreground">
                Conocé los rangos salariales del mercado para tu perfil y experiencia en Argentina y Latam.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Perfil Acumulativo</h3>
              <p className="text-muted-foreground">
                Con el plan Pro, la IA aprende de tus análisis anteriores y te da feedback cada vez más preciso.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Elegí tu plan
            </h2>
            <p className="text-muted-foreground text-lg">
              Empezá gratis y pasá a Pro cuando quieras más poder
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 bg-card border-border relative overflow-hidden">
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Free</h3>
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

              <Link href="/app" className="block">
                <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted min-h-[48px]">
                  Empezar gratis
                </Button>
              </Link>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 bg-card border-2 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  Popular
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">$9.99</span>
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

              <Link href="/app" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-h-[48px]">
                  Activar Pro
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                ¿Qué es un sistema ATS?
              </h3>
              <p className="text-muted-foreground">
                ATS (Applicant Tracking System) es un software que usan las empresas para filtrar CVs automáticamente antes de que lleguen a un reclutador humano. Si tu CV no está optimizado, puede ser descartado sin que nadie lo lea.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                ¿Mis datos están seguros?
              </h3>
              <p className="text-muted-foreground">
                Sí, tu CV se procesa de forma segura y no almacenamos el contenido después del análisis en el plan Free. Con el plan Pro, guardamos tu historial para darte mejor feedback, pero nunca compartimos tus datos con terceros.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                ¿Qué formatos de CV aceptan?
              </h3>
              <p className="text-muted-foreground">
                Actualmente aceptamos archivos PDF y DOCX. Recomendamos PDF ya que mantiene mejor el formato original de tu CV.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                ¿Cómo funciona el perfil acumulativo?
              </h3>
              <p className="text-muted-foreground">
                Con el plan Pro, nuestra IA aprende de cada análisis que hacés. Identifica patrones recurrentes en tus CVs y te da sugerencias cada vez más personalizadas basadas en tu historial y objetivos profesionales.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
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
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Empezá a optimizar tu CV hoy
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Más de 5000 profesionales en Argentina y Latam ya mejoraron sus CVs con PowerCV. Es gratis y te toma menos de un minuto.
          </p>
          <Link href="/app">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-6 min-h-[56px]">
              Analizar mi CV gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">PowerCV</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contacto
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              2025 PowerCV. Hecho en Argentina.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
