import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  cookies().delete('next-auth.session-token')
  return new NextResponse('Clear')
}
