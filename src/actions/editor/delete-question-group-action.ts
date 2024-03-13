'use server'

import { getSessionUserIdOrThrow, isGroupOwnerOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import z from 'zod'

export const deleteQuestionGroupAction = async (id: string): Promise<ActionResultType<void>> => {
  const errors = ZparseOrError(z.string(), id)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
  await isGroupOwnerOrThrow(id, userId)

  try {
    await prisma.$transaction(async (tx) => {

      await tx.choices.deleteMany({
        where: {
          answer:{
            room:{
              groupId: id
            }
          }
        }
      })

      await tx.answer.deleteMany({
        where: {
          room:{
            groupId: id
          }
        }
      })

      await tx.room.deleteMany({
        where: {
          groupId: id
        }
      })

      await tx.questionGroup.delete({
        where: {
          id: id
        }
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
      message: 'Database Error: Failed to delete questions group: ' + error.message,
    }
  }
}
