'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AdminPage() {
  const [name, setName] = useState('')
  const [deadline, setDeadline] = useState('')

  const createGW = async () => {
    await supabase.from('gameweeks').insert({ name, deadline_utc: deadline })
    alert('Jornada creada ✅')
  }

  const handleFile = async (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const text = await file.text()
    const rows = text.trim().split('\n').slice(1) // quita header
    for (const row of rows) {
      const [player_id, gameweek_id, points] = row.split(',')
      await supabase.from('player_points').upsert({
        player_id,
        gameweek_id,
        points: parseInt(points)
      })
    }
    alert('Puntos importados ✅')
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold text-green-500 mb-6">Panel Admin</h1>

      <div className="bg-gray-900 p-4 rounded mb-6">
        <h2 className="font-semibold text-green-400 mb-2">Crear Jornada</h2>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre de la jornada"
          className="w-full border border-green-600 bg-gray-800 text-white px-3 py-2 mb-3 rounded"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          className="w-full border border-green-600 bg-gray-800 text-white px-3 py-2 mb-3 rounded"
        />
        <button
          onClick={createGW}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
        >
          Crear
        </button>
      </div>

      <div className="bg-gray-900 p-4 rounded">
        <h2 className="font-semibold text-green-400 mb-2">Importar puntos (CSV)</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="block w-full text-sm text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-green-600 file:text-white
            hover:file:bg-green-700"
        />
      </div>
    </div>
  )
}
