import './globals.css'
import Navbar from './components/navbar'

export const metadata = {
  title: 'Fantasy Union',
  description: 'Fantasy del equipo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-black text-white">
        <Navbar />   {/* 👈 barra arriba en todas las páginas */}
        <main>{children}</main>
      </body>
    </html>
  )
}
