'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MailCheck, MailWarning } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as z from 'zod'

const SignInSchema = z.object({
  email: z.string().email()
})

type SignInSchemaType = z.infer<typeof SignInSchema>

export default function SubscribeForm() {
  const { t } = useTranslation('global')

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema)
  })

  const {
    handleSubmit,
    register,
    setError,
    formState: { isSubmitting, isSubmitSuccessful, errors, isValid },
  } = form

  const signWithEmail = async (data: SignInSchemaType) => {
    // Fix "try another account" ==> invalid prisma session delete
    await fetch('/api/clear-session', {
      method: 'POST',
    })

    const response = await signIn('email', { email: data.email, redirect: false })
    if (!response?.ok) {
      setError('root.serverError', { type: 'custom', message: t('SignInError') })
    }
  }

  return (
    <>
      <form id="form-subscribe" noValidate className="m-2 flex space-x-2" onSubmit={handleSubmit(signWithEmail)}>
        <Input className="p-6" placeholder={t('EnterMail')} type="email" inputMode="email" {...register('email')} />
        <Button className="p-6" type="submit" disabled={isSubmitting || !isValid} >
          {isSubmitting && <Loader2 className="-ml-1 mr-3 animate-spin" />}
          {t('SignIn')}
        </Button>
      </form>

      {isSubmitSuccessful && !isSubmitting &&
                <p className="animate-wiggle font-semibold text-green-700">
                  <MailCheck className="mr-2 inline" />{t('SignInSuccess')}
                </p>}

      {errors.root?.serverError &&
                <p className="animate-wiggle font-semibold text-red-700">
                  <MailWarning className="mr-2 inline" /> {errors.root?.serverError.message}
                </p>}
    </>
  )
}
