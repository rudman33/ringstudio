import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { checkAndConsumeDesignCredit } from '../../../../lib/design-limits'

// Allow this route up to 55s on Vercel (Hobby/Pro cap is 60s) since
// Replicate image generation can occasionally be slow.
export const maxDuration = 55

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })

const metalDesc: Record<string,string> = {
  'Yellow Gold': '18k yellow gold',
  'White Gold': '18k white gold with rhodium plating',
  'Rose Gold': '18k rose gold with warm pink hue',
  'Platinum': '950 platinum, cool silver-white',
  'Two-Tone': '18k two-tone yellow and white gold',
}
const stoneDesc: Record<string,string> = {
  Diamond: 'brilliant white diamond with exceptional fire and sparkle',
  Sapphire: 'deep royal blue sapphire',
  Emerald: 'rich vivid green emerald',
  Ruby: 'vivid red ruby',
  Morganite: 'soft blush pink morganite',
  Moissanite: 'near-colorless moissanite with rainbow fire',
}
const shapeDesc: Record<string,string> = {
  Round: 'round brilliant cut',
  Princess: 'princess cut',
  Oval: 'oval cut',
  Cushion: 'cushion cut',
  Marquise: 'marquise cut',
  Pear: 'pear shaped cut',
  'Emerald cut': 'emerald cut',
  Radiant: 'radiant cut',
}
const settingDesc: Record<string,string> = {
  Solitaire: 'classic solitaire setting',
  Halo: 'diamond halo setting',
  'Pavé': 'pavé set band',
  'Three Stone': 'three-stone setting',
  Bezel: 'bezel setting',
  Vintage: 'vintage filigree setting',
}

function buildPrompt(sel: any) {
  const metal = metalDesc[sel.metal] || sel.metal || 'gold'
  const stone = stoneDesc[sel.stone] || sel.stone || 'diamond'
  const shape = shapeDesc[sel.shape] || sel.shape || 'round'
  const setting = settingDesc[sel.setting] || sel.setting || 'solitaire'
  const carat = sel.carat || ''
  const type = sel.type === 'Wedding Band' ? 'wedding band' : 'engagement ring'

  return `Professional jewelry product photography of a luxury ${type} featuring a ${carat} ${shape} ${stone}, set in a ${setting}, crafted in ${metal}. Macro photography, studio lighting, soft diffused light, pure white seamless background, ultra high detail, 8K resolution, photorealistic, commercial product shot, shallow depth of field.`
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  try {
    const body = await req.json()

    if (!body.account_id) {
      return NextResponse.json({ error: 'Missing account_id' }, { status: 400 })
    }

    const limitCheck = await checkAndConsumeDesignCredit(body.account_id)
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: 'We\'re unable to generate a preview right now. Please contact the jeweler directly to continue.' },
        { status: 429 }
      )
    }

    const prompt = buildPrompt(body.selections || {})

    const output = await replicate.run(
      'black-forest-labs/flux-schnell',
      {
        input: {
          prompt,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'jpg',
          output_quality: 90,
        }
      }
    ) as any

    const elapsedMs = Date.now() - startedAt

    let imageUrl = Array.isArray(output) ? output[0] : output

    // Handle ReadableStream / FileOutput object from Replicate SDK
    if (imageUrl && typeof imageUrl === 'object' && imageUrl.url) {
      imageUrl = typeof imageUrl.url === 'function' ? imageUrl.url() : imageUrl.url
    }
    if (imageUrl && typeof imageUrl.toString === 'function' && typeof imageUrl !== 'string') {
      imageUrl = imageUrl.toString()
    }

    // Replicate can resolve `run()` successfully (no thrown error) but still
    // hand back a null/empty output — e.g. account rate-limited or out of
    // credit, or the safety filter suppressed the image. Previously this
    // silently returned `{ url: null }` with a 200, which the UI shows as a
    // generic "couldn't generate a preview" with no diagnostic trail. Log
    // loudly and return a real error status so this is visible in Vercel
    // runtime error logs instead of disappearing.
    if (!imageUrl) {
      console.error('Visualization returned empty output', {
        account_id: body.account_id,
        elapsedMs,
        rawOutputType: typeof output,
        rawOutput: JSON.stringify(output)?.slice(0, 500),
      })
      return NextResponse.json(
        { error: 'Image generation returned no result. This usually means the Replicate account is out of credit, rate-limited, or the request was filtered. Check the Replicate dashboard.' },
        { status: 502 }
      )
    }

    if (elapsedMs > 15000) {
      // Not an error, but flux-schnell normally finishes in a few seconds.
      // Anything over ~15s is worth knowing about even on success.
      console.warn('Visualization succeeded but was unusually slow', { account_id: body.account_id, elapsedMs })
    }

    return NextResponse.json({ url: imageUrl, prompt })
  } catch (e: any) {
    console.error('Visualization error:', e, { elapsedMs: Date.now() - startedAt })
    return NextResponse.json({ error: e.message || 'Failed to generate image' }, { status: 500 })
  }
}
