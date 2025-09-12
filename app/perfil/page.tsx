'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PerfilPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()
      if (data) setName(data.name || '')
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', user.id)
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
