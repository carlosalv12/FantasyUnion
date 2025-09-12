import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  await supabase.auth.signOut()

  // 🚀 Tras logout, mandamos directo al login
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
