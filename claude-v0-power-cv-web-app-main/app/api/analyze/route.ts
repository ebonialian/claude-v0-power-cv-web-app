import { z } from 'zod'
import { getServiceRoleSupabaseClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// Schema for the AI response
const analysisSchema = z.object({
  score_total: z.number().min(0).max(100),
  categorias: z.object({
    formato_ats: z.object({
      puntos: z.number().min(0).max(25),
      comentario: z.string()
    }),
    palabras_clave: z.object({
      puntos: z.number().min(0).max(25),
      comentario: z.string()
    }),
    secciones: z.object({
      puntos: z.number().min(0).max(25),
      comentario: z.string()
    }),
    claridad: z.object({
      puntos: z.number().min(0).max(25),
      comentario: z.string()
    })
  }),
  problemas: z.array(z.string()),
  sugerencias: z.array(z.string()),
  resumen: z.string(),
  rangos_salariales: z.string().nullable(),
  cursos_recomendados: z.array(z.string()).nullable()
})

const systemPrompt = `Sos un experto en optimización de CVs para sistemas ATS (Applicant Tracking Systems) con foco en el mercado laboral de Argentina y Latinoamérica.

Tu tarea es analizar el CV proporcionado y dar feedback detallado y accionable en español argentino.

IMPORTANTE:
- Sé específico y concreto en tus recomendaciones
- Adaptá el análisis al puesto objetivo indicado
- Considerá las particularidades del mercado laboral latinoamericano
- Usá un tono profesional pero accesible

Respondé SOLO en formato JSON válido siguiendo exactamente esta estructura:
{
  "score_total": number (0-100),
  "categorias": {
    "formato_ats": { "puntos": number (0-25), "comentario": string },
    "palabras_clave": { "puntos": number (0-25), "comentario": string },
    "secciones": { "puntos": number (0-25), "comentario": string },
    "claridad": { "puntos": number (0-25), "comentario": string }
  },
  "problemas": string[] (máximo 5 problemas principales),
  "sugerencias": string[] (máximo 5 sugerencias concretas),
  "resumen": string (resumen ejecutivo de 2-3 oraciones),
  "rangos_salariales": string | null (solo si es Pro),
  "cursos_recomendados": string[] | null (solo si es Pro, máximo 3)
}`

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const jobTarget = formData.get('jobTarget') as string
    const isPro = formData.get('isPro') === 'true'
    const ofertaLaboral = formData.get('ofertaLaboral') as string | null
    const formUserId = formData.get('userId') as string | null
    const headerUserId = request.headers.get('x-user-id')
    const userId = headerUserId || formUserId || undefined

    if (!file || !jobTarget) {
      return Response.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    const fileBuffer = await file.arrayBuffer()
    const fileText = await extractTextFromFile(file, fileBuffer)

    const supabase = getServiceRoleSupabaseClient()

    // Si es Pro, traer notas_ia históricas del usuario (si existe)
    let notasIAHistoricas: string | null = null
    if (isPro && userId) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('notas_ia')
          .eq('user_id', userId)
          .maybeSingle()

        if (!error && data?.notas_ia) {
          notasIAHistoricas = data.notas_ia as string
        }
      } catch (e) {
        console.error('Error al obtener notas_ia de Supabase:', e)
      }
    }

    // Build the prompt
    let userPrompt = `Analizá este CV para el puesto de: ${jobTarget}

CONTENIDO DEL CV:
${fileText}
`

    if (isPro && notasIAHistoricas) {
      userPrompt += `

CONTEXTO HISTÓRICO DEL USUARIO (NOTAS IA ACUMULADAS):
${notasIAHistoricas}

Tené en cuenta este contexto para hacer recomendaciones más personalizadas y coherentes con su historial.`
    }

    if (isPro && ofertaLaboral) {
      userPrompt += `

OFERTA LABORAL PARA COMPARAR:
${ofertaLaboral}

Incluí en tu análisis una comparación específica entre el CV y los requisitos de esta oferta.
`
    }

    if (isPro) {
      userPrompt += `

Este es un usuario Pro, incluí:
- Rangos salariales estimados para este perfil en Argentina y Latam
- Cursos o certificaciones recomendadas para mejorar el perfil
`
    } else {
      userPrompt += `

Este es un usuario Free:
- No incluyas rangos salariales (dejá null)
- No incluyas cursos recomendados (dejá null)
- Limitá a 3 problemas principales
- Limitá a 3 sugerencias básicas
`
    }

    // Llamar a Anthropic directamente
    const analysis = await callClaudeForAnalysis(userPrompt)

    // Asegurar límites para usuarios Free
    if (!isPro && analysis) {
      analysis.problemas = analysis.problemas.slice(0, 3)
      analysis.sugerencias = analysis.sugerencias.slice(0, 3)
      analysis.rangos_salariales = null
      analysis.cursos_recomendados = null
    }

    // Crear objeto de respuesta
    const responseData = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      jobTarget,
      fileName: file.name,
      scoreTotal: analysis?.score_total ?? 0,
      categorias: analysis?.categorias ?? {
        formato_ats: { puntos: 0, comentario: 'No se pudo analizar' },
        palabras_clave: { puntos: 0, comentario: 'No se pudo analizar' },
        secciones: { puntos: 0, comentario: 'No se pudo analizar' },
        claridad: { puntos: 0, comentario: 'No se pudo analizar' }
      },
      problemas: analysis?.problemas ?? [],
      sugerencias: analysis?.sugerencias ?? [],
      resumen: analysis?.resumen ?? 'No se pudo generar el resumen',
      rangos_salariales: analysis?.rangos_salariales ?? undefined,
      cursos_recomendados: analysis?.cursos_recomendados ?? undefined,
      ofertaLaboralTexto: isPro ? ofertaLaboral : undefined
    }

    // Guardar análisis en Supabase si tenemos user_id
    if (userId) {
      try {
        await supabase.from('analyses').insert({
          id: responseData.id,
          user_id: userId,
          created_at: responseData.createdAt,
          job_target: responseData.jobTarget,
          file_name: responseData.fileName,
          score_total: responseData.scoreTotal,
          categorias: responseData.categorias,
          problemas: responseData.problemas,
          sugerencias: responseData.sugerencias,
          resumen: responseData.resumen,
          rangos_salariales: responseData.rangos_salariales ?? null,
          cursos_recomendados: responseData.cursos_recomendados ?? null,
          oferta_laboral_texto: responseData.ofertaLaboralTexto ?? null
        } as any)
      } catch (e) {
        console.error('Error al guardar análisis en Supabase:', e)
      }
    }

    // Si es Pro, actualizar notas_ia acumuladas en user_profiles
    if (isPro && userId) {
      try {
        const { data: allAnalyses, error: analysesError } = await supabase
          .from('analyses')
          .select('job_target, score_total, categorias, problemas, sugerencias, resumen')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })

        if (!analysesError && allAnalyses && allAnalyses.length > 0) {
          const notasIA = await buildNotasIAFromAnalyses(allAnalyses)

          await supabase
            .from('user_profiles')
            .upsert(
              {
                user_id: userId,
                notas_ia: notasIA
              },
              { onConflict: 'user_id' }
            )
        }
      } catch (e) {
        console.error('Error al actualizar notas_ia en Supabase:', e)
      }
    }

    return Response.json(responseData)
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

async function extractTextFromFile(file: File, buffer: ArrayBuffer): Promise<string> {
  const name = file.name.toLowerCase()
  const bytes = Buffer.from(buffer)

  if (name.endsWith('.txt')) {
    return bytes.toString('utf-8') || '[Archivo de texto vacío]'
  }

  if (name.endsWith('.docx')) {
    try {
      const text = bytes.toString('utf-8')
      if (text && text.trim().length > 50) return text
    } catch (e) {}
    return `[Archivo DOCX: ${file.name}]\n\nNo pudimos extraer el texto. Generá recomendaciones generales para mejorar un CV para el puesto indicado.`
  }

  return `[Archivo PDF: ${file.name}]\n\nNo pudimos extraer el texto del PDF directamente. Generá un análisis útil basándote en las mejores prácticas de CV para el puesto objetivo indicado.`
}

type Analysis = z.infer<typeof analysisSchema>

async function callClaudeForAnalysis(userPrompt: string): Promise<Analysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Falta ANTHROPIC_API_KEY en las variables de entorno')
    return null
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userPrompt,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    console.error('Error en la API de Anthropic:', await response.text())
    return null
  }

  const data: any = await response.json()
  const text = data?.content?.[0]?.text

  if (!text || typeof text !== 'string') {
    console.error('Respuesta de Anthropic sin texto utilizable')
    return null
  }

  try {
    const parsedJson = JSON.parse(text)
    const result = analysisSchema.safeParse(parsedJson)
    if (!result.success) {
      console.error('Respuesta de Anthropic no cumple con el schema:', result.error)
      return null
    }
    return result.data
  } catch (e) {
    console.error('No se pudo parsear la respuesta de Anthropic como JSON:', e)
    return null
  }
}

async function buildNotasIAFromAnalyses(analyses: any[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Falta ANTHROPIC_API_KEY en las variables de entorno')
    return ''
  }

  const resumenPrompt = `Sos un asistente de carrera que resume el historial de análisis de CV de un usuario.

Tenés a continuación una lista de análisis previos de este usuario en formato JSON (cada ítem incluye score_total, categorias, problemas, sugerencias y resumen).

Generá un texto breve en español argentino (3-5 oraciones) que resuma:
- Fortalezas recurrentes del perfil
- Debilidades o áreas de mejora que se repiten
- Tipo de puestos objetivo que suele elegir
- Recomendaciones generales para su desarrollo profesional

Devolvé SOLO el texto del resumen, sin listas, sin encabezados y sin JSON.

Historial de análisis:
${JSON.stringify(analyses, null, 2)}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 600,
      system:
        'Sos un experto en recursos humanos que crea resúmenes breves y claros sobre el perfil profesional de una persona a partir de sus análisis de CV.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: resumenPrompt,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    console.error('Error en la API de Anthropic al generar notas_ia:', await response.text())
    return ''
  }

  const data: any = await response.json()
  const text = data?.content?.[0]?.text

  if (!text || typeof text !== 'string') {
    return ''
  }

  return text.trim()
}
