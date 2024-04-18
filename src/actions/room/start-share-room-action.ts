'use server'

import { ActionResultType, withValidate } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { RoomStartSchema, RoomStartType } from '@/lib/schema'
import { computeNextQuestionQuery } from '@/queries/actions-queries'
import { translate } from '@/queries/utils-queries'
import { revalidatePath } from 'next/cache'

export const startShareRoomAction = withValidate(
  RoomStartSchema,
  async (data: RoomStartType): Promise<ActionResultType<void>> => {

    const { t } = await translate('actions')

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
        message: t('ErrorServer', { message: error.message })
      }
    }
  })
