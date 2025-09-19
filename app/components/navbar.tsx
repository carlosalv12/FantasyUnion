'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
// Update the import path below if your useUser hook is located elsewhere, for example:
import { useUser } from '../hooks/useUser'
// If the correct path is different, adjust '../hooks/useUser' to the actual relative path.

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, loading } = useUser()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className="bg-[#111827] text-white border-b border-green-600">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-14">
        {/* Logo + Nombre */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⚽</span>
          <span className="text-green-500 font-bold">Fantasy Unión</span>
        </div>

        {/* Botón hamburguesa (móvil) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* Links desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/alinear" className="hover:text-green-400">Alinear</Link>
          <Link href="/resultados" className="hover:text-green-400">Resultados</Link>
          <Link href="/perfil" className="hover:text-green-400">Perfil</Link>
          <Link href="/admin" className="hover:text-green-400">Admin</Link>

          {loading ? null : user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-300">{user.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-[#1f2937]">
          <Link href="/alinear" className="block hover:text-green-400">Alinear</Link>
          <Link href="/resultados" className="block hover:text-green-400">Resultados</Link>
          <Link href="/perfil" className="block hover:text-green-400">Perfil</Link>
          <Link href="/admin" className="block hover:text-green-400">Admin</Link>

          {loading ? null : user ? (
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-300">{user.email}</span>
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="block bg-green-600 hover:bg-green-700 text-center text-white font-semibold py-2 px-3 rounded"
            >
              Entrar
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
