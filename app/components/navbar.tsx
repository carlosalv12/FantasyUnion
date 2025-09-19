'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [open, setOpen] = useState(false)

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
          <Link
            href="/auth/login"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
          >
            Entrar
          </Link>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-[#1f2937]">
          <Link href="/alinear" className="block hover:text-green-400">Alinear</Link>
          <Link href="/resultados" className="block hover:text-green-400">Resultados</Link>
          <Link href="/perfil" className="block hover:text-green-400">Perfil</Link>
          <Link href="/admin" className="block hover:text-green-400">Admin</Link>
          <Link
            href="/auth/login"
            className="block bg-green-600 hover:bg-green-700 text-center text-white font-semibold py-2 px-3 rounded"
          >
            Entrar
          </Link>
        </div>
      )}
    </nav>
  )
}
