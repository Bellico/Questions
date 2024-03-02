'use server'

import { computeNextQuestionQuery, getSessionUserIdOrThrow, isGroupOwnerOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { RoomSettingsSchema, RoomSettingsType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const startRoomAction = async (data: RoomSettingsType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(RoomSettingsSchema, data)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
  await isGroupOwnerOrThrow(data.groupId, userId)

  const nextQuestionId = await computeNextQuestionQuery(data.groupId, data.withRandom, [])

  try {
    const roomId = await prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          groupId: data.groupId,
          dateStart: new Date(),
          userId: userId,
          mode: data.mode,
          withRetry: data.withRetry > 0 ? Number(data.withRetry) : null,
          withResults: data.withResults,
          withCorrection: data.withCorrection,
          withRandom: data.withRandom,
          withProgress: data.withProgress
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

      return room.id
    })

    revalidatePath('/start/')

    return {
      success: true,
      data: roomId
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to start room: ' + error.message,
    }
  }
}
