import './globals.css';  // Or your CSS file
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Emelifts - Fitness',
  description: 'Your path to a stronger, fitter, leaner you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}