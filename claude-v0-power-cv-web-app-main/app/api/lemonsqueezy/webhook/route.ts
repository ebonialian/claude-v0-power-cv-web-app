import { NextResponse } from "next/server"
import crypto from "crypto"
import { getServiceRoleSupabaseClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const supabase = getServiceRoleSupabaseClient()

  try {
    const rawBody = await request.text()

    const signatureHeader = request.headers.get("X-Signature")
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("Falta LEMONSQUEEZY_WEBHOOK_SECRET en variables de entorno")
      return NextResponse.json({ error: "Configuración de webhook incompleta." }, { status: 500 })
    }

    if (!signatureHeader) {
      return NextResponse.json({ error: "Falta la firma del webhook." }, { status: 400 })
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody, "utf8")
      .digest("hex")

    if (signatureHeader !== expectedSignature) {
      console.error("Firma de webhook inválida.")
      return NextResponse.json({ error: "Firma no válida." }, { status: 400 })
    }

    const event = JSON.parse(rawBody) as any
    const eventType: string | undefined = event?.meta?.event_name
    const customData = event?.meta?.custom_data || {}
    const userId: string | undefined = customData.user_id

    if (!userId) {
      console.warn("Webhook de Lemon Squeezy sin user_id en custom_data.", event.meta)
      return NextResponse.json({ received: true }, { status: 200 })
    }

    const subscription = event?.data?.attributes
    const status: string | undefined = subscription?.status
    const renewsAt: string | null = subscription?.renews_at ?? null
    const manageUrl: string | null = subscription?.urls?.update_payment_method ?? null
    const subscriptionId: string | undefined = event?.data?.id

    try {
      if (eventType === "subscription_created") {
        await supabase
          .from("profiles")
          .update({
            plan: "pro",
            lemonsqueezy_subscription_id: subscriptionId,
            lemonsqueezy_status: status,
            lemonsqueezy_renews_at: renewsAt,
            lemonsqueezy_manage_url: manageUrl,
          } as any)
          .eq("id", userId)
      } else if (eventType === "subscription_updated") {
        const newPlan = status === "active" || status === "on_trial" ? "pro" : "free"
        await supabase
          .from("profiles")
          .update({
            plan: newPlan,
            lemonsqueezy_status: status,
            lemonsqueezy_renews_at: renewsAt,
            lemonsqueezy_manage_url: manageUrl,
          } as any)
          .eq("id", userId)
      } else if (eventType === "subscription_cancelled") {
        await supabase
          .from("profiles")
          .update({
            plan: "free",
            lemonsqueezy_status: status ?? "cancelled",
            lemonsqueezy_renews_at: null,
          } as any)
          .eq("id", userId)
      } else {
        // Otros eventos se ignoran por ahora
      }
    } catch (e) {
      console.error("Error al actualizar perfil en Supabase desde webhook:", e)
      return NextResponse.json({ error: "No se pudo actualizar el estado de la suscripción." }, { status: 500 })
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Error procesando webhook de Lemon Squeezy:", error)
    return NextResponse.json(
      { error: "Error al procesar el webhook de Lemon Squeezy." },
      { status: 500 },
    )
  }
}

