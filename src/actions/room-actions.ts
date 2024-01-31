'use server'

import { getSessionUserId, isGroupOwner } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { RoomSettingsSchema, RoomSettingsType } from '@/lib/schema'
import { ActionResultType, ZparseOrError, randomNextOrder } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const startRoom = async (data: RoomSettingsType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(RoomSettingsSchema, data)
  if (errors) return errors

  const userId = await getSessionUserId()
  await isGroupOwner(data.groupId, userId)

  const allOrderQuetion = await prisma.question.findMany({
    where: {
      groupId: data.groupId
    },
    select:{
      id: true,
      order: true
    },
    orderBy:{
      order: 'asc'
    }
  })

  let questionId = allOrderQuetion[0].id

  if(data.withRandom){
    const orders = allOrderQuetion.map(o => o.order)
    const firstOrderQuestion = randomNextOrder(orders, [])
    questionId = allOrderQuetion.find(o => o.order === firstOrderQuestion)?.id!
  }

  try {
    const roomId = await prisma.$transaction(async (tx) => {

      const room = await prisma.room.create({
        data: {
          groupId: data.groupId,
          dateStart: new Date(),
          userId: userId,
          display: data.display,
          mode: data.mode,
          withTimer: data.withTimer,
          withResults: data.withResults,
          withCorrection: data.withCorrection,
          withRandom: data.withRandom,
        }
      })

      await prisma.answer.create({
        data: {
          roomId: room.id,
          order: 1,
          dateStart: new Date(),
          questionId: questionId
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
