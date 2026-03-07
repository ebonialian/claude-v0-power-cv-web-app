import { generateText, Output } from 'ai'
import { z } from 'zod'

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

    if (!file || !jobTarget) {
      return Response.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Extract text from file
    // For PDF files, we'll read the buffer and extract text
    // Note: In production, you'd use a proper PDF parser like pdf-parse
    const fileBuffer = await file.arrayBuffer()
    const fileText = await extractTextFromFile(file, fileBuffer)

    // Build the prompt
    let userPrompt = `Analizá este CV para el puesto de: ${jobTarget}

CONTENIDO DEL CV:
${fileText}
`

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

    // Call AI to analyze
    const result = await generateText({
      model: 'anthropic/claude-sonnet-4-20250514',
      system: systemPrompt,
      prompt: userPrompt,
      output: Output.object({ schema: analysisSchema }),
      maxOutputTokens: 2000,
    })

    const analysis = result.output

    // Ensure free users only get limited results
    if (!isPro && analysis) {
      analysis.problemas = analysis.problemas.slice(0, 3)
      analysis.sugerencias = analysis.sugerencias.slice(0, 3)
      analysis.rangos_salariales = null
      analysis.cursos_recomendados = null
    }

    // Create the response object
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

    return Response.json(responseData)
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: 'Error al analizar el CV' },
      { status: 500 }
    )
  }
}

async function extractTextFromFile(file: File, _buffer: ArrayBuffer): Promise<string> {
  // For demo purposes, we'll try to read as text
  // In production, you'd use pdf-parse for PDFs and mammoth for DOCX
  
  if (file.name.endsWith('.pdf')) {
    // For PDF, try to extract text - this is a simplified approach
    // Production would use pdf-parse or similar library
    try {
      const text = await file.text()
      // If we got some readable text, use it
      if (text && text.length > 100 && !text.includes('%PDF')) {
        return text
      }
      // Otherwise return a placeholder that tells the AI to work with what it has
      return `[Archivo PDF: ${file.name}]
      
Nota: Este es un archivo PDF. Analizá basándote en el nombre del archivo y el puesto objetivo proporcionado. 
Generá un análisis genérico pero útil con recomendaciones comunes para CVs en el puesto indicado.

Para una demostración completa, el usuario debería proporcionar el texto del CV directamente o usar un servicio de parsing de PDFs.`
    } catch {
      return `[Archivo PDF: ${file.name}] - Generá recomendaciones generales para el puesto indicado.`
    }
  }
  
  if (file.name.endsWith('.docx')) {
    // For DOCX, try text extraction
    try {
      const text = await file.text()
      if (text && text.length > 50) {
        return text
      }
      return `[Archivo DOCX: ${file.name}] - Generá recomendaciones generales para el puesto indicado.`
    } catch {
      return `[Archivo DOCX: ${file.name}] - Generá recomendaciones generales para el puesto indicado.`
    }
  }
  
  return `[Archivo: ${file.name}] - Generá recomendaciones generales para el puesto indicado.`
}
