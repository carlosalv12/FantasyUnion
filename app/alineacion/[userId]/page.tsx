'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type FormationKey = keyof typeof FORMACIONES

const FORMACIONES = {
  "4-3-3": { POR: 1, DEF: 4, MED: 3, DEL: 3 },
  "4-4-2": { POR: 1, DEF: 4, MED: 4, DEL: 2 },
  "3-5-2": { POR: 1, DEF: 3, MED: 5, DEL: 2 },
  "5-4-1": { POR: 1, DEF: 5, MED: 4, DEL: 1 }
}

export default function AlineacionDetalle() {
  const params = useParams()
  const searchParams = useSearchParams()
  const userId = params?.userId as string
  const gwId = searchParams.get('gw')

  const [lineup, setLineup] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [points, setPoints] = useState<Record<string, number>>({})
  const [formation, setFormation] = useState<FormationKey>("4-3-3")
  const [deadline, setDeadline] = useState<Date | null>(null)

  // Cargar jugadores
  useEffect(() => {
    const load = async () => {
      const { data: p } = await supabase.from('players').select('*')
      setPlayers(p || [])
    }
    load()
  }, [])

  // Cargar perfil, alineación, deadline y puntos
  useEffect(() => {
    const load = async () => {
      if (!userId || !gwId) return

      // perfil
      const { data: prof } = await supabase.from('profiles').select('id,name').eq('id', userId).single()
      setProfile(prof)

      // jornada (deadline)
      const { data: gw } = await supabase.from('gameweeks').select('deadline_utc').eq('id', gwId).single()
      if (gw) setDeadline(new Date(gw.deadline_utc))

      // alineación
      const { data: l } = await supabase
        .from('lineups')
        .select('*')
        .eq('user_id', userId)
        .eq('gameweek_id', gwId)
        .single()

      if (l) {
        setLineup(l)
        setFormation(l.formation as FormationKey)
      }

      // puntos
      const { data: pts } = await supabase
        .from('player_points')
        .select('player_id, points')
        .eq('gameweek_id', gwId)

      const map: Record<string, number> = {}
      pts?.forEach((row: any) => (map[row.player_id] = row.points))
      setPoints(map)
    }
    load()
  }, [userId, gwId])

  if (!lineup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-green-500">
        Cargando alineación…
      </div>
    )
  }

  const currentFormation = FORMACIONES[formation]
  const picks: string[] = lineup.picks_json || []

  const renderSlots = (pos: keyof typeof currentFormation, count: number) => {
    const chosen = players.filter(p => picks.includes(p.id) && p.position === pos)
    return (
      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length: count }).map((_, i) => {
          const player = chosen[i]
          return (
            <div
              key={i}
              className="w-28 h-12 flex items-center justify-center border border-green-600 bg-gray-800 rounded text-xs text-center"
            >
              {player
                ? `#${player.number} ${player.name} (${points[player.id] ?? 0})`
                : pos}
            </div>
          )
        })}
      </div>
    )
  }

  const totalPoints = picks.reduce((sum, pid) => sum + (points[pid] ?? 0), 0)

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-green-500 mb-4">
        Alineación de {profile?.name || 'Jugador'}
      </h1>

      {deadline && (
        <p className="mb-4 text-sm text-gray-400">
          Cierre: {deadline.toLocaleString()}
        </p>
      )}

      <p className="mb-6">Formación: {formation}</p>

      {renderSlots("POR", currentFormation.POR)}
      {renderSlots("DEF", currentFormation.DEF)}
      {renderSlots("MED", currentFormation.MED)}
      {renderSlots("DEL", currentFormation.DEL)}

      {Object.keys(points).length > 0 && (
        <p className="text-right text-green-400 font-bold mt-4">
          Total: {totalPoints} pts
        </p>
      )}
    </div>
  )
}
