'use client'
import Login from '@/components/Login'
import { robotoCondensed } from '@/app/fonts/fonts'
import './index.css'

export default function LoginPage() {
  return (
    <main className={robotoCondensed.className}>
      <Login />
    </main>
  )
}
