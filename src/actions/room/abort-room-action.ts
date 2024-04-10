'use server'

import { getActiveRoomQuery, getSessionUserIdOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export const abortRoomAction = async (id : string): Promise<ActionResultType<void>> => {
  const errors = ZparseOrError(z.string(), id)

  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
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
      message: 'Database Error: Failed to abort room: ' + error.message,
    }
  }
}
