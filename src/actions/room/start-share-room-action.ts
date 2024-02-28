'use server'

import { computeNextQuestionQuery } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { RoomStartShareSchema, RoomStartShareType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const startShareRoomAction = async (data: RoomStartShareType): Promise<ActionResultType<void>> => {
  const errors = ZparseOrError(RoomStartShareSchema, data)
  if (errors) return errors

  const room = await prisma.room.findFirstOrThrow({
    where:{
      id: data.roomId,
      shareLink: data.shareLink,
      dateStart: null
    }
  })

  const nextQuestionId = await computeNextQuestionQuery(room.groupId, room.withRandom, [])

  try {
    await prisma.$transaction(async (tx) => {

      await tx.room.update({
        where:{
          id: room.id
        },
        data:{
          dateStart: new Date()
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

    revalidatePath('/share/')

    return {
      success: true,
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to start room: ' + error.message,
    }
  }
}
