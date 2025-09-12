'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    })
    if (!error) setSent(true)
    else alert(error.message)
  }

  if (sent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <p className="text-green-500 text-lg font-semibold">
          ✅ Revisa tu correo para el link
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-sm bg-gray-900 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-green-500 text-center">
          Fantasy - Unin el parque ⚽
        </h1>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-green-600 bg-gray-800 text-white px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="tu@email.com"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Enviar Invitación
        </button>
      </div>
    </div>
  )
}
