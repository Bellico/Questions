'use server'

import { canPlayRoomQuery, getNextQuestionToAnswerQuery, getSessionUserId } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { PrevNextRoomSchema, PrevNextRoomType, RoomQuestionNextType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { RoomMode } from '@prisma/client'

export const navigateRoomAction = async (data: PrevNextRoomType): Promise<ActionResultType<RoomQuestionNextType>> => {
  const errors = ZparseOrError(PrevNextRoomSchema, data)
  if (errors) return errors

  const userId = await getSessionUserId()

  // If null provided (random case) get next question to answer
  if (!data.questionId) {
    const room = await canPlayRoomQuery(data.roomId, userId, data.shareLink)

    if (!room) {
      throw new Error('403 Forbidden')
    }

    const next = await getNextQuestionToAnswerQuery(data.roomId)
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

const canNavigateRoom = async (roomId: string, questionId: string, userId?: string, shareLink?: string) : Promise<RoomQuestionNextType> => {
  const result = await prisma.answer.findFirstOrThrow({
    where: {
      questionId: questionId,
      room:{
        id: roomId,
        dateEnd: null,
        mode: RoomMode.Training,
        AND: [
          {
            OR: [
              {
                userId: userId,
              },
              {
                shareLink: shareLink,
              },
            ],
          },
        ]
      }
    },
    select: {
      order: true,
      dateEnd: true,
      achievement: true,
      choices:{
        select:{
          responseId: true
        }
      },
      room:{
        select: {
          withCorrection: true
        }
      },
      question:{
        select: {
          id: true,
          title: true,
          subject: true,
          responses:{
            select:{
              id: true,
              text: true,
              isCorrect: true
            }
          }
        }
      }
    }
  })

  return{
    questionId : result.question?.id!,
    title: result?.question?.title || `Question ${result.order}`,
    subject: result.question?.subject!,
    responses: result.question?.responses.map(r => ({ id: r.id, text: r.text }))!,
    navigate: result.dateEnd === null ? undefined : {
      hasGood: result.achievement === 100,
      correction: result.room.withCorrection ? result.question?.responses.filter(r => r.isCorrect).map(r => r.id)! : null,
      choices: result.choices.map(c => c.responseId)
    }
  }
}
