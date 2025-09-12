'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PerfilPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()
      if (data) setName(data.name || '')
      setLoading(false)
    }

    loadProfile()

    // 👇 escuchar cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push('/auth/login')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  const save = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', user.id)
    setSaving(false)
    if (!error) alert('Perfil guardado ✅')
    else alert('Error al guardar')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-green-500">
        Cargando perfil…
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-sm bg-gray-900 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-green-500 text-center">
          Tu Perfil
        </h1>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-green-600 bg-gray-800 text-white px-3 py-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Tu nombre"
        />
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
