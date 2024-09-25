'use server'

import { ActionResultType, withValidateAndSession } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { getGroupInProgressQuery } from '@/queries/commons-queries'
import { translate } from '@/queries/utils-queries'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const abortRoomAction = withValidateAndSession(
  z.string(),
  async (id: string, userId: string): Promise<ActionResultType<void>> => {

    const { t } = await translate('actions')

    const activeRooms = await getGroupInProgressQuery([id], userId)
    if (activeRooms.length === 0) {
      throw new Error('403 Forbidden')
    }

    const activeRoomId = activeRooms[0].id

    try {
      await prisma.$transaction(async (tx) => {

        await tx.choices.deleteMany({
          where: {
            answer:{
              roomId: activeRoomId
            }
          }
        })

        await tx.answer.deleteMany({
          where: {
            roomId: activeRoomId
          }
        })

        await tx.room.delete({
          where:{
            id: activeRoomId
          },
        })

      })

      revalidatePath('/board')

      return {
        success: true
      }
    }
    catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          success: false,
          message: t('ErrorServer', { message: error.message })
        }
      }
      throw error
    }
  })
