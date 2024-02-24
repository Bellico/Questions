'use server'

import { canAnswerQuestion, canNavigateRoom, canPlayRoom, computeNextQuestion, getAnsweredQuestionIdsInRoom, getNextQuestionToAnswer, getSessionUserId, getSessionUserIdOrThrow, isGroupOwnerOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { AnswerRoomReturnType, AnswerRoomSchema, AnswerRoomType, PrevNextRoomSchema, PrevNextRoomType, RoomQuestionNextType, RoomSettingsSchema, RoomSettingsType } from '@/lib/schema'
import { ActionResultType, ZparseOrError, computeScore } from '@/lib/utils'
import { RoomMode } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const startRoom = async (data: RoomSettingsType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(RoomSettingsSchema, data)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
  await isGroupOwnerOrThrow(data.groupId, userId)

  const nextQuestionId = await computeNextQuestion(data.groupId, data.withRandom, [])

  try {
    const roomId = await prisma.$transaction(async (tx) => {
      const room = await tx.room.create({
        data: {
          groupId: data.groupId,
          dateStart: new Date(),
          userId: userId,
          mode: data.mode,
          withTimer: data.withTimer,
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

export const answerRoom = async (data: AnswerRoomType): Promise<ActionResultType<AnswerRoomReturnType>> => {
  const errors = ZparseOrError(AnswerRoomSchema, data)
  if (errors) return errors

  const userId = await getSessionUserId()
  const currentAnswerContext = await canAnswerQuestion(data.roomId, data.questionId, userId, data.shareLink)

  if (!currentAnswerContext) {
    throw new Error('403 Forbidden')
  }

  const goodResponseIds = currentAnswerContext.question?.responses.map(r => r.id)!
  const totalGoodResponse = goodResponseIds.length
  const goodChoicesCount = goodResponseIds.filter(rId => data.choices.includes(rId)).length

  const diff = goodChoicesCount - (data.choices.length - totalGoodResponse)
  const trueGoodResponse = data.choices.length > totalGoodResponse ? Math.max(diff, 0) : goodChoicesCount
  const achievement = (trueGoodResponse * 100) / totalGoodResponse

  const answeredQuestionIds = await getAnsweredQuestionIdsInRoom(data.roomId)
  const nextQuestionId = await computeNextQuestion(currentAnswerContext.room.groupId!, currentAnswerContext.room.withRandom, answeredQuestionIds)
  const withResult = currentAnswerContext.room.mode == RoomMode.Training

  try {
    await prisma.$transaction(async (tx) => {

      await tx.answer.update({
        where: {
          id: currentAnswerContext.id
        },
        data: {
          achievement,
          dateEnd: new Date(),
          choices: {
            create: data.choices.map(rId => ({ responseId: rId}))
          }
        }
      })

      // Prepare next question if exists
      if(nextQuestionId){
        await tx.answer.create({
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
        const results = await tx.answer.findMany({
          where:{
            roomId: data.roomId,
          },
          select:{
            achievement: true
          }
        })

        const score = computeScore(results.map(r => r.achievement!))

        await tx.room.update({
          where: {
            id: data.roomId
          },
          data: {
            score: score.score,
            successCount: score.success,
            failedCount: score.failed,
            dateEnd: new Date(),
          },
        })
      }

    })
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to answer question: ' + error.message,
    }
  }

  return {
    success: true,
    data: {
      next: await getNextQuestionToAnswer(data.roomId),
      result: {
        id: currentAnswerContext.question?.id!,
        title : currentAnswerContext.question?.title || `Question ${currentAnswerContext.order}`,
        hasGood : withResult ? achievement === 100 : null,
        correction: currentAnswerContext.room.withCorrection ? goodResponseIds : null
      }
    }
  }
}

export const navigateRoom = async (data: PrevNextRoomType): Promise<ActionResultType<RoomQuestionNextType>> => {
  const errors = ZparseOrError(PrevNextRoomSchema, data)
  if (errors) return errors

  const userId = await getSessionUserId()

  // If null provided (random case) get next question to answer
  if (!data.questionId) {
    const room = await canPlayRoom(data.roomId, userId, data.shareLink)

    if (!room) {
      throw new Error('403 Forbidden')
    }

    const next = await getNextQuestionToAnswer(data.roomId)
    if (! next) {
      throw new Error('Can\'t navigate to questionId null')
    }

    return {
      success: true,
      data: next
    }
  }

  const navigateQuestion = await canNavigateRoom(data.roomId, data.questionId, userId, data.shareLink)

  if (!navigateQuestion) {
    throw new Error('403 Forbidden')
  }

  return {
    success: true,
    data: navigateQuestion
  }
}
