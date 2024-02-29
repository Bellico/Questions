import { getSessionUserIdOrThrow } from '@/actions/queries'
import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  await getSessionUserIdOrThrow()

  const data = await request.formData()
  const file: File | null = data.get('image') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const { url } = await put(file.name, file, { access: 'public' })

  return NextResponse.json({ success: true, url })
}
