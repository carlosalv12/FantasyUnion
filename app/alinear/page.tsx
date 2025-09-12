'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type FormationKey = keyof typeof FORMACIONES

const FORMACIONES = {
  "4-3-3": { POR: 1, DEF: 4, MED: 3, DEL: 3 },
  "4-4-2": { POR: 1, DEF: 4, MED: 4, DEL: 2 },
  "3-5-2": { POR: 1, DEF: 3, MED: 5, DEL: 2 },
  "5-4-1": { POR: 1, DEF: 5, MED: 4, DEL: 1 }
}

export default function AlinearPage() {
  const [players, setPlayers] = useState<any[]>([])
  const [formation, setFormation] = useState<FormationKey>("4-3-3")
  const [lineup, setLineup] = useState<{ [pos: string]: (string | null)[] }>({
    POR: [],
    DEF: [],
    MED: [],
    DEL: []
  })
  const [selecting, setSelecting] = useState<{ pos: string; index: number } | null>(null)
  const [gameweeks, setGameweeks] = useState<any[]>([])
  const [gwId, setGwId] = useState<string | null>(null)
  const [deadline, setDeadline] = useState<Date | null>(null)
  const [points, setPoints] = useState<Record<string, number>>({})
  const [userId, setUserId] = useState<string | null>(null)

  // Cargar usuario
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    loadUser()
  }, [])

  // Cargar jugadores
  useEffect(() => {
    const loadPlayers = async () => {
      const { data: p } = await supabase.from('players').select('*').order('position, number')
      setPlayers(p || [])
    }
    loadPlayers()
  }, [])

  // Cargar jornadas
  useEffect(() => {
    const loadGWs = async () => {
      const { data } = await supabase.from('gameweeks').select('*').order('deadline_utc')
      setGameweeks(data || [])
      if (data && data.length > 0) setGwId(data[0].id)
    }
    loadGWs()
  }, [])

  // Cuando cambia jornada seleccionada → cargar alineación guardada + puntos + deadline
  useEffect(() => {
    const loadLineup = async () => {
      if (!gwId || !userId) return

      // deadline
      const { data: gw } = await supabase.from('gameweeks').select('deadline_utc').eq('id', gwId).single()
      if (gw) setDeadline(new Date(gw.deadline_utc))

      // lineup guardado
      const { data: l } = await supabase
        .from('lineups')
        .select('*')
        .eq('user_id', userId)
        .eq('gameweek_id', gwId)
        .single()

      if (l) {
        setFormation(l.formation as FormationKey)
        // reconstruir slots
        const f = FORMACIONES[l.formation as FormationKey]
        const picks: string[] = l.picks_json || []
        const byPos: { [pos: string]: (string | null)[] } = {
          POR: [],
          DEF: [],
          MED: [],
          DEL: []
        }
        for (const pos of Object.keys(f) as (keyof typeof f)[]) {
          const chosen = players.filter(p => picks.includes(p.id) && p.position === pos).map(p => p.id)
          byPos[pos] = [...chosen, ...Array(f[pos] - chosen.length).fill(null)]
        }
        setLineup(byPos)
      } else {
        // si no hay lineup guardado → limpiar
        const f = FORMACIONES[formation]
        setLineup({
          POR: Array(f.POR).fill(null),
          DEF: Array(f.DEF).fill(null),
          MED: Array(f.MED).fill(null),
          DEL: Array(f.DEL).fill(null),
        })
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

    loadLineup()
  }, [gwId, userId, players])

  const openSelector = (pos: string, index: number) => {
    if (deadline && new Date() > deadline) return // bloquear selección si pasó deadline
    setSelecting({ pos, index })
  }

  const choosePlayer = (playerId: string) => {
    if (!selecting) return

    setLineup(prev => {
      const updated = {
        POR: [...prev.POR],
        DEF: [...prev.DEF],
        MED: [...prev.MED],
        DEL: [...prev.DEL],
      }

      // quitar duplicados
      for (const key of Object.keys(updated)) {
        updated[key as keyof typeof updated] =
          updated[key as keyof typeof updated].map(val => (val === playerId ? null : val))
      }

      updated[selecting.pos as keyof typeof updated][selecting.index] = playerId
      return updated
    })
    setSelecting(null)
  }

  const renderSlots = (pos: keyof typeof FORMACIONES["4-3-3"], count: number) => {
    return (
      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length: count }).map((_, i) => {
          const playerId = lineup[pos][i]
          const player = players.find(p => p.id === playerId)
          return (
            <div
              key={i}
              onClick={() => openSelector(pos, i)}
              className="w-24 h-12 flex items-center justify-center border border-green-600 bg-gray-800 rounded cursor-pointer text-xs text-center"
            >
              {player
                ? `${player.name} (${points[player.id] ?? 0})`
                : pos}
            </div>
          )
        })}
      </div>
    )
  }

  const save = async () => {
    if (!gwId || !userId) return
    const picks = Object.values(lineup).flat().filter(Boolean)
    if (picks.length !== 11) {
      alert("Debes elegir 11 jugadores")
      return
    }
    await supabase.from('lineups').upsert({
      user_id: userId,
      gameweek_id: gwId,
      picks_json: picks,
      formation: formation
    })
    alert("Alineación guardada ✅")
  }

  const currentFormation = FORMACIONES[formation]
  const totalPoints = Object.values(lineup).flat().reduce((sum, pid) => sum + (pid ? (points[pid] ?? 0) : 0), 0)
  const deadlinePassed = deadline ? new Date() > deadline : false

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-green-500 mb-4">Alinear</h1>

      {/* Selección de jornada */}
      <div className="mb-6">
        <label className="mr-2">Jornada:</label>
        <select
          value={gwId ?? ''}
          onChange={e => setGwId(e.target.value)}
          className="bg-gray-800 border border-green-600 rounded px-2 py-1"
        >
          {gameweeks.map(gw => (
            <option key={gw.id} value={gw.id}>{gw.name}</option>
          ))}
        </select>
      </div>

      {/* Fecha de cierre */}
      {deadline && (
        <p className="mb-4 text-sm text-gray-400">
          Cierra el {deadline.toLocaleString()}
        </p>
      )}

      {/* Selección de formación */}
      <div className="mb-6">
        <label className="mr-2">Formación:</label>
        <select
          value={formation}
          onChange={e => setFormation(e.target.value as FormationKey)}
          className="bg-gray-800 border border-green-600 rounded px-2 py-1"
          disabled={deadlinePassed}
        >
          {Object.keys(FORMACIONES).map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      {/* Slots */}
      {renderSlots("POR", currentFormation.POR)}
      {renderSlots("DEF", currentFormation.DEF)}
      {renderSlots("MED", currentFormation.MED)}
      {renderSlots("DEL", currentFormation.DEL)}

      {/* Total */}
      {Object.keys(points).length > 0 && (
        <p className="text-right text-green-400 font-bold mt-2">
          Total: {totalPoints} pts
        </p>
      )}

      {/* Botón de guardar */}
      {!deadlinePassed && (
        <button
          onClick={save}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
        >
          Guardar Alineación
        </button>
      )}

      {/* Selector de jugadores */}
      {selecting && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-gray-900 p-4 rounded w-80 max-h-[70vh] overflow-y-auto">
            <h2 className="text-green-400 font-bold mb-3">Elige {selecting.pos}</h2>
            <ul className="space-y-2">
              {players
                .filter(p => p.position === selecting.pos)
                .map(p => (
                  <li
                    key={p.id}
                    onClick={() => choosePlayer(p.id)}
                    className="cursor-pointer px-3 py-2 bg-gray-800 rounded hover:bg-green-600 hover:text-white flex justify-between"
                  >
                    <span>#{p.number} {p.name}</span>
                    <span className="text-green-400">{points[p.id] ?? 0} pts</span>
                  </li>
                ))}
            </ul>
            <button
              onClick={() => setSelecting(null)}
              className="mt-4 w-full border border-green-600 px-3 py-1 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
