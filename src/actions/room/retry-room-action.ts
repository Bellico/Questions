'use server'

import { ActionResultType, withValidate } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { RoomStartSchema, RoomStartType } from '@/lib/schema'
import { canRetryRoomQuery, computeNextQuestionQuery } from '@/queries/actions-queries'
import { getSessionUserId } from '@/queries/commons-queries'
import { translate } from '@/queries/utils-queries'
import { Prisma } from '@prisma/client'

export const retryRoomAction = withValidate(
  RoomStartSchema,
  async (data: RoomStartType): Promise<ActionResultType<string>> => {

    const { t } = await translate('actions')

    const userId = await getSessionUserId()
    const room = await canRetryRoomQuery(data.roomId, userId, data.shareLink)
    const nextQuestionId = await computeNextQuestionQuery(room.groupId, room.withRandom, [])

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

        await tx.room.update({
          where:{
            id: room.id
          },
          data:{
            dateEnd: null,
            withRetry: { decrement: 1 }
          }
        })

        await tx.answer.create({
          data: {
            roomId: room.id,
            order: 1,
            dateStart: new Date(),
            questionId: nextQuestionId
          }
        })

      })

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
