import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { checkAndConsumeDesignCredit } from '../../../../lib/design-limits'

// NOTE: deliberately no maxDuration override here. This project's default
// (Fluid Compute) function timeout is well above the ~55-62s flux-schnell
// has been taking, and testing showed setting an explicit maxDuration=55
// made things WORSE — Vercel killed the function with
// FUNCTION_INVOCATION_TIMEOUT at exactly 55s, before the improved error
// handling below could even run. If you need a hard cap, set it comfortably
// above observed latency (e.g. 90+) rather than near it.

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

    // Use predictions.create + wait (instead of the run() shortcut) so that
    // on failure we get the actual Replicate-side status/error/logs instead
    // of a bare thrown Error or a silently empty output. This is what
    // surfaced the original bug: run() was resolving with a null output and
    // no exception at all when something went wrong upstream.
    let prediction = await replicate.predictions.create({
      model: 'black-forest-labs/flux-schnell',
      input: {
        prompt,
        num_outputs: 1,
        aspect_ratio: '1:1',
        output_format: 'jpg',
        output_quality: 90,
      },
    })
    prediction = await replicate.wait(prediction)

    const elapsedMs = Date.now() - startedAt

    if (prediction.status !== 'succeeded') {
      console.error('Visualization prediction did not succeed', {
        account_id: body.account_id,
        elapsedMs,
        status: prediction.status,
        error: prediction.error,
        logs: prediction.logs,
        id: prediction.id,
      })
      return NextResponse.json(
        { error: `Image generation failed (${prediction.status}): ${prediction.error || 'no error detail from Replicate'}` },
        { status: 502 }
      )
    }

    const output = prediction.output as any
    let imageUrl = Array.isArray(output) ? output[0] : output

    // Handle ReadableStream / FileOutput object from Replicate SDK
    if (imageUrl && typeof imageUrl === 'object' && imageUrl.url) {
      imageUrl = typeof imageUrl.url === 'function' ? imageUrl.url() : imageUrl.url
    }
    if (imageUrl && typeof imageUrl.toString === 'function' && typeof imageUrl !== 'string') {
      imageUrl = imageUrl.toString()
    }

    // Prediction says "succeeded" but handed back nothing usable — e.g. the
    // safety filter suppressed the image. Log everything we have instead of
    // returning a silent 200 with a null url.
    if (!imageUrl) {
      console.error('Visualization succeeded but returned no usable output', {
        account_id: body.account_id,
        elapsedMs,
        id: prediction.id,
        logs: prediction.logs,
        rawOutput: JSON.stringify(output)?.slice(0, 500),
      })
      return NextResponse.json(
        { error: 'Image generation completed but returned no image (often a safety-filter suppression). See Vercel logs / Replicate prediction ' + prediction.id + ' for detail.' },
        { status: 502 }
      )
    }

    if (elapsedMs > 15000) {
      // Not an error, but flux-schnell normally finishes in a few seconds.
      // Anything over ~15s is worth knowing about even on success.
      console.warn('Visualization succeeded but was unusually slow', { account_id: body.account_id, elapsedMs, id: prediction.id })
    }

    return NextResponse.json({ url: imageUrl, prompt })
  } catch (e: any) {
    console.error('Visualization error:', e, { elapsedMs: Date.now() - startedAt })
    return NextResponse.json({ error: e.message || 'Failed to generate image' }, { status: 500 })
  }
}
