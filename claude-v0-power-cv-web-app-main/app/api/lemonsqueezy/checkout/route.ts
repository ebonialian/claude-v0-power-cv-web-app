import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    console.log("ENV CHECK:", {
      hasApiKey: !!process.env.LEMONSQUEEZY_API_KEY,
      hasStoreId: !!process.env.LEMONSQUEEZY_STORE_ID,
      hasVariantId: !!process.env.LEMONSQUEEZY_VARIANT_ID,
    })
    const body = await request.json().catch(() => null) as {
      userId?: string
      email?: string
    } | null

    const userId = body?.userId
    const email = body?.email

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Faltan userId o email del usuario." },
        { status: 400 },
      )
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY
    const storeId = process.env.LEMONSQUEEZY_STORE_ID
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID

    if (!apiKey || !storeId || !variantId) {
      return NextResponse.json(
        { error: "Faltan credenciales de Lemon Squeezy en las variables de entorno." },
        { status: 500 },
      )
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email,
              custom: {
                user_id: userId,
              },
            },
            custom_price: 497, // 4.97 USD en centavos
          },
          relationships: {
            store: {
              data: {
                type: "stores",
                id: storeId,
              },
            },
            variant: {
              data: {
                type: "variants",
                id: variantId,
              },
            },
          },
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("Error al crear checkout en Lemon Squeezy:", response.status, errorText)
return NextResponse.json(
  { error: errorText },
  { status: 502 },
)
      return NextResponse.json(
        { error: "No pudimos crear el checkout de Lemon Squeezy. Probá de nuevo en unos minutos." },
        { status: 502 },
      )
    }

    const json: any = await response.json()
    const checkoutUrl: string | undefined =
      json?.data?.attributes?.url || json?.data?.attributes?.checkout_url

    if (!checkoutUrl) {
      console.error("Respuesta de Lemon Squeezy sin URL de checkout:", json)
      return NextResponse.json(
        { error: "No recibimos la URL de pago de Lemon Squeezy." },
        { status: 502 },
      )
    }

    return NextResponse.json({ checkoutUrl })
  } catch (error) {
    console.error("Error en endpoint de checkout de Lemon Squeezy:", error)
    return NextResponse.json(
      { error: "Ocurrió un error al iniciar el checkout. Probá de nuevo." },
      { status: 500 },
    )
  }
}

