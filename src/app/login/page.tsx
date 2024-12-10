

import { robotoCondensed } from '@/app/fonts/fonts'
import './index.css'
import LoginForm from '@/modules/login-page/login-form'

export default function LoginPage() {
  return (
    <main className={robotoCondensed.className}>
      <LoginForm />
    </main>
  )
}
