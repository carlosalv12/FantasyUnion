'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      router.push('/perfil')
    }
  }

  const handleSignup = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      router.push('/perfil')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-sm bg-gray-900 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-green-500 text-center">
          Fantasy - Unión el parque ⚽
        </h1>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-green-600 bg-gray-800 text-white px-3 py-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Correo electrónico"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-green-600 bg-gray-800 text-white px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Contraseña"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition mb-2 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Iniciar Sesión'}
        </button>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </div>
    </div>
  )
}
