import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Fix "try another account" ==> invalid prisma session delete
  cookies().delete('next-auth.session-token')

  const url = new URL(request.url)
  const email = url.searchParams.get('email')

  var user = await prisma.user.findFirst({
    where:{
      email: email,
    },
    select: {
      password: true
    }
  })

  return NextResponse.json({
    goToLogin: user && user.password !== null
  })
}