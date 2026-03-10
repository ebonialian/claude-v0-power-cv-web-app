"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Check, Crown, Sparkles } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { useState } from "react"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const freeFeatures = [
  "Análisis ilimitados",
  "Score ATS detallado",
  "3 problemas principales",
  "3 sugerencias básicas",
  "PDF básico descargable",
]

const proFeatures = [
  "Todo lo del plan Free",
  "Historial completo de análisis",
  "Perfil acumulativo con IA",
  "Comparación con ofertas laborales",
  "Rangos salariales del mercado",
  "Cursos recomendados",
  "PDF premium personalizado",
  "Recursos y guías completas",
]

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { updatePlan, isPro } = useUser()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async () => {
    setIsProcessing(true)
    
    /**
     * MERCADO PAGO INTEGRATION - TODO
     * 
     * Endpoints necesarios:
     * 
     * 1. POST /api/mercadopago/create-preference
     *    - Crea una preferencia de pago con los datos del plan Pro
     *    - Retorna init_point (URL de checkout)
     *    - Body: { user_id, plan: 'pro', amount: 9.99 }
     *    
     * 2. POST /api/mercadopago/webhook
     *    - Recibe notificaciones de Mercado Pago (IPN)
     *    - Actualiza profiles.plan = 'pro' cuando payment.status === 'approved'
     *    - Guarda mp_subscription_id en profiles
     *    
     * 3. GET /api/mercadopago/subscription-status
     *    - Verifica el estado actual de la suscripción del usuario
     *    
     * Flujo:
     * 1. Usuario hace click en "Activar Pro"
     * 2. Se crea preferencia de pago → retorna init_point
     * 3. Redirigir a init_point (Mercado Pago Checkout)
     * 4. Usuario completa el pago en MP
     * 5. MP envía webhook a /api/mercadopago/webhook
     * 6. Backend actualiza el plan del usuario en la DB
     * 7. Usuario es redirigido de vuelta a /app con plan actualizado
     * 
     * Ejemplo de creación de preferencia (backend):
     * 
     * import mercadopago from 'mercadopago'
     * mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN })
     * 
     * const preference = await mercadopago.preferences.create({
     *   items: [{
     *     title: 'PowerCV Pro - Mensual',
     *     unit_price: 9.99,
     *     currency_id: 'USD',
     *     quantity: 1,
     *   }],
     *   back_urls: {
     *     success: `${process.env.NEXT_PUBLIC_URL}/app?upgrade=success`,
     *     failure: `${process.env.NEXT_PUBLIC_URL}/app?upgrade=failure`,
     *     pending: `${process.env.NEXT_PUBLIC_URL}/app?upgrade=pending`,
     *   },
     *   auto_return: 'approved',
     *   notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
     *   external_reference: user.id,
     * })
     * 
     * return preference.body.init_point
     */
    
    // Demo simulation - replace with actual MP integration
    await new Promise(resolve => setTimeout(resolve, 1500))
    updatePlan('pro')
    setIsProcessing(false)
    onOpenChange(false)
  }

  if (isPro) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
          <DialogTitle className="text-2xl text-foreground flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            Ya sos Pro
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Tenés acceso a todas las funcionalidades premium de PowerCV.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <ul className="space-y-3">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Activá PowerCV Pro
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Desbloqueá todo el potencial para optimizar tu CV y conseguir más entrevistas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Free Plan */}
          <div className="p-5 rounded-xl bg-muted border border-border">
            <h3 className="font-display text-lg font-semibold text-foreground mb-1">Free</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground text-sm">/siempre</span>
            </div>
            <ul className="space-y-2">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="p-5 rounded-xl bg-primary/5 border-2 border-primary relative">
            <div className="absolute -top-3 right-4">
              <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                Popular
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              Pro
              <Crown className="w-4 h-4 text-primary" />
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-foreground">$9.99</span>
              <span className="text-muted-foreground text-sm">USD/mes</span>
            </div>
            <ul className="space-y-2">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-h-[48px]"
          >
            {isProcessing ? (
              "Procesando..."
            ) : (
              <>
                <Crown className="w-4 h-4 mr-2" />
                Activar Pro - $9.99 USD/mes
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Pago seguro con Mercado Pago. Cancelá cuando quieras.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
