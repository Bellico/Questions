'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MailCheck, MailWarning } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const SignInSchema = z.object({
  email: z.string().email()
})

type SignInSchemaType = z.infer<typeof SignInSchema>;

export default function SubscribeForm() {

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema)
  })

  const { handleSubmit,
    register,
    setError,
    formState: { isSubmitting, isSubmitSuccessful, errors },
  } = form

  const signWithEmail = async (data: SignInSchemaType) => {
    const response = await signIn('email', { email: data.email, redirect: false })
    if (!response?.ok) {
      setError('root.serverError', { type: 'custom', message: 'Error to send mail' })
    }
  }

  return (
    <>
      <form id="form-subscribe" noValidate className="flex space-x-2" onSubmit={handleSubmit(signWithEmail)}>
        <Input placeholder="Enter your email" type="email" {...register('email')} />
        <Button type="submit" disabled={isSubmitting} >
          {isSubmitting && <Loader2 className="-ml-1 mr-3 animate-spin" />}
                    Sign In
        </Button>
      </form>

      {isSubmitSuccessful && !isSubmitting &&
                <p className="animate-wiggle font-semibold text-green-700">
                  <MailCheck className="mr-2 inline" />Check your mail to sign in
                </p>}

      {errors.root?.serverError &&
                <p className="animate-wiggle font-semibold text-red-700">
                  <MailWarning className="mr-2 inline" /> {errors.root?.serverError.message}
                </p>}
    </>
  )
}
