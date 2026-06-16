import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const path = `inspiration/${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('ring-images')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage
    .from('ring-images')
    .getPublicUrl(path)

  return NextResponse.json({ url: publicUrl })
}