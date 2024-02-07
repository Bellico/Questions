'use server'

import { canAnswerQuestion, computeNextQuestion, getAnsweredQuestionIdsInRoom, getNextQuestionToAnswer, getSessionUserId, getSessionUserIdOrThrow, isGroupOwnerOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { AnswerRoomReturnType, AnswerRoomSchema, AnswerRoomType, RoomSettingsSchema, RoomSettingsType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const startRoom = async (data: RoomSettingsType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(RoomSettingsSchema, data)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
  await isGroupOwnerOrThrow(data.groupId, userId)

  const nextQuestionId = await computeNextQuestion(data.groupId, data.withRandom, [])

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

export const answerRoom = async (data: AnswerRoomType): Promise<ActionResultType<AnswerRoomReturnType | null>> => {
  const errors = ZparseOrError(AnswerRoomSchema, data)
  if (errors) return errors

  const userId = await getSessionUserId()
  const currentAnswerContext = await canAnswerQuestion(data.roomId, data.questionId, userId, data.shareLink )

  if (!currentAnswerContext) {
    throw new Error('403 Forbidden')
  }

  try {
    await prisma.$transaction(async (tx) => {

      await prisma.answer.update({
        where: {
          id: currentAnswerContext.id
        },
        data: {
          achievement: 100,
          dateEnd: new Date(),
          //responseId: '0',
        },
      })

      const answeredQuestionIds = await getAnsweredQuestionIdsInRoom(data.roomId)
      const nextQuestionId = await computeNextQuestion(currentAnswerContext.room.groupId!, currentAnswerContext.room.withRandom, answeredQuestionIds)

      // Prepare next question if exists
      if(nextQuestionId){
        await prisma.answer.create({
          data: {
            roomId: data.roomId,
            order: currentAnswerContext.order + 1,
            dateStart: new Date(),
            questionId: nextQuestionId
          }
        })
      }

      // Else End room
      else{
        await prisma.room.update({
          where: {
            id: data.roomId
          },
          data: {
            dateEnd: new Date(),
          },
        })
      }

    })

    // revalidatePath(`/room/${data.roomId}`)

    const nextQuestion = await getNextQuestionToAnswer(data.roomId)

    return {
      success: true,
      data: nextQuestion
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to answer question: ' + error.message,
    }
  }
}
