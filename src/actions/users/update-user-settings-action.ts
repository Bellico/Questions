'use server'

import { ActionResultType, withValidateAndSession } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { UserSettingsSchema, UserSettingsType } from '@/lib/schema'
import { capitalize } from '@/lib/utils'
import { cookies } from 'next/headers'

export const updateUserSettingsAction = withValidateAndSession(
  UserSettingsSchema,
  async (data: UserSettingsType, userId: string): Promise<ActionResultType<void>> => {

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        name:  data.username ? capitalize(data.username) : null,
      },
    })

    cookies().set('locale', data.locale, { maxAge: Date.now() })

    return {
      success: true
    }
  })
