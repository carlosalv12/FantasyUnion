'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

export default function ResultadosPage() {
  const [gameweeks, setGameweeks] = useState<any[]>([])
  const [selected, setSelected] = useState<string>('global')
  const [rows, setRows] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const { data: g } = await supabase.from('gameweeks').select('*').order('deadline_utc')
      setGameweeks(g || [])
    }
    load()
  }, [])

  useEffect(() => {
    const load = async () => {
      if (selected === 'global') {
        const { data } = await supabase
          .from('scoreboard_global')
          .select(`
            user_id,
            total_points,
            profiles (
              name
            )
          `)
          .order('total_points', { ascending: false })
        setRows(data || [])
      } else {
        const { data } = await supabase
          .from('scoreboard_gameweek')
          .select(`
            user_id,
            total_points,
            profiles (
              name
            )
          `)
          .eq('gameweek_id', selected)
          .order('total_points', { ascending: false })
        setRows(data || [])
      }
    }
    if (selected) load()
  }, [selected])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold text-green-500 mb-6">Resultados</h1>

      {/* Selección de ranking */}
      <div className="mb-6">
        <label className="mr-2">Ranking:</label>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="bg-gray-800 border border-green-600 rounded px-2 py-1"
        >
          <option value="global">Global</option>
          {gameweeks.map(gw => (
            <option key={gw.id} value={gw.id}>
              {gw.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de resultados */}
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li
            key={i}
            className="bg-gray-900 p-3 rounded flex justify-between items-center"
          >
            <span className="font-semibold">
              {i + 1}. {r.profiles?.name || r.user_id}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-green-500 font-bold">{r.total_points} pts</span>
              {selected !== 'global' && (
                <Link
                  href={`/alineacion/${r.user_id}?gw=${selected}`}
                  className="text-sm text-green-400 underline hover:text-green-300"
                >
                  Ver alineación
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
