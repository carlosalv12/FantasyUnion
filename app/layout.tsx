import './globals.css'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const metadata = {
  title: 'Fantasy Unión el Parque',
  description: 'Fantasy interno del equipo'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="es">
      <body className="font-sans bg-black text-white">
        {/* Barra de navegación */}
        <nav className="bg-gray-900 border-b border-green-600">
          <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-green-500 font-bold text-xl">⚽ Fantasy Unión</h1>
            <div className="flex space-x-4 items-center">
              <Link
                href="/alinear"
                className="hover:text-green-400 transition"
              >
                Alinear
              </Link>
              <Link
                href="/resultados"
                className="hover:text-green-400 transition"
              >
                Resultados
              </Link>
              <Link
                href="/perfil"
                className="hover:text-green-400 transition"
              >
                Perfil
              </Link>
              <Link
                href="/admin"
                className="hover:text-green-400 transition"
              >
                Admin
              </Link>

              {/* Auth dinámico */}
              {!user ? (
                <Link
                  href="/auth/login"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                >
                  Entrar
                </Link>
              ) : (
                <form action="/auth/logout" method="post">
                  <span className="mr-2 text-sm text-gray-300">
                    {user.email}
                  </span>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                  >
                    Salir
                  </button>
                </form>
              )}
            </div>
          </div>
        </nav>

        {/* Contenido principal */}
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
