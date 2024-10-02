'use server'

import { ActionResultType, withValidateAndSession } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { canDeleteRoomQuery } from '@/queries/actions-queries'
import { translate } from '@/queries/utils-queries'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const deleteRoomAction = withValidateAndSession(
  z.string(),
  async (id: string, userId: string): Promise<ActionResultType<void>> => {

    const { t } = await translate('actions')
    const room = await canDeleteRoomQuery(id, userId)

    try {
      await prisma.$transaction(async (tx) => {

        await tx.choices.deleteMany({
          where: {
            answer:{
              roomId: room.id
            }
          }
        })

        await tx.answer.deleteMany({
          where: {
            roomId: room.id
          }
        })

        await tx.room.delete({
          where:{
            id: room.id
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
