'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut()
      router.push('/login')
    }
    logout()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-green-500">
      Cerrando sesión...
    </div>
  )
}
