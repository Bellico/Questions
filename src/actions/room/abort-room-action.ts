'use server'

import { ActionResultType, withValidateAndSession } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { getActiveRoomQuery } from '@/queries/commons-queries'
import { translate } from '@/queries/utils-queries'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const abortRoomAction = withValidateAndSession(
  z.string(),
  async (id: string, userId: string): Promise<ActionResultType<void>> => {

    const { t } = await translate('actions')

    const activeRoom = await getActiveRoomQuery(id, userId)

    if (!activeRoom) {
      throw new Error('403 Forbidden')
    }

    try {
      await prisma.$transaction(async (tx) => {

        await tx.choices.deleteMany({
          where: {
            answer:{
              roomId: activeRoom.id
            }
          }
        })

        await tx.answer.deleteMany({
          where: {
            roomId: activeRoom.id
          }
        })

        await tx.room.delete({
          where:{
            id: activeRoom.id
          },
        })

      })

      revalidatePath('/board')

      return {
        success: true
      }
    }
    catch (error: any) {
      return {
        success: false,
        message: t('ErrorServer', { message: error.message })
      }
    }
  })
