import { cookies } from 'next/headers'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

export function supabaseServer(context: { req: any; res: any }) {
  return createPagesServerClient(context)
}
