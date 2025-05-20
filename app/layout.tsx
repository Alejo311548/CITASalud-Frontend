import './globals.css'
import { Montserrat } from 'next/font/google'
import { ReactNode } from 'react'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'CITASalud',
  description: 'Plataforma para agendamiento de citas médicas',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans bg-blue-50 m-0 p-0">
        {children}
      </body>
    </html>
  )
}
