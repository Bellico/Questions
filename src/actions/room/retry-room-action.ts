'use server'

import { canRetryRoomQuery, computeNextQuestionQuery, getSessionUserId } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { RoomStartSchema, RoomStartType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'

export const retryRoomAction = async (data: RoomStartType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(RoomStartSchema, data)
  if (errors) return errors

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
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to retry room: ' + error.message,
    }
  }
}
