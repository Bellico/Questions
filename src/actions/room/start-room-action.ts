'use server'

import { ActionResultType, withValidateAndSession } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { RoomSettingsSchema, RoomSettingsType } from '@/lib/schema'
import { computeNextQuestionQuery, isGroupOwnerOrThrow } from '@/queries/actions-queries'
import { translate } from '@/queries/utils-queries'
import { revalidatePath } from 'next/cache'

export const startRoomAction = withValidateAndSession(
  RoomSettingsSchema,
  async (data: RoomSettingsType, userId: string): Promise<ActionResultType<string>> => {

    const { t } = await translate('actions')

    await isGroupOwnerOrThrow(data.groupId, userId)

    const nextQuestionId = await computeNextQuestionQuery(data.groupId, data.withRandom, [])
    const dateStart = new Date()

    try {
      const roomId = await prisma.$transaction(async (tx) => {
        const room = await tx.room.create({
          data: {
            groupId: data.groupId,
            dateStart,
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
            dateStart,
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
        message: t('ErrorServer', { message: error.message })
      }
    }
  })
