'use client'

import { useFormState } from 'react-dom'
import { login } from '@/lib/actions/auth.actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const [state, action] = useFormState(login, undefined)

  return (
    <form action={action} className="space-y-4 w-full max-w-sm">
      <div>
        <label htmlFor="email">Email</label>
        <Input type="email" id="email" name="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input type="password" id="password" name="password" required />
      </div>
      <Button type="submit" className="w-full">Login</Button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  )
}
