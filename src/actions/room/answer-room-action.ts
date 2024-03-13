'use server'

import { computeNextQuestionQuery, getNextQuestionToAnswerQuery, getSessionUserId } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { AnswerRoomReturnType, AnswerRoomSchema, AnswerRoomType } from '@/lib/schema'
import { ActionResultType, ZparseOrError, computeScore } from '@/lib/utils'
import { RoomMode } from '@prisma/client'

export const answerRoomAction = async (data: AnswerRoomType): Promise<ActionResultType<AnswerRoomReturnType>> => {
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
  const nextQuestionId = await computeNextQuestionQuery(currentAnswerContext.room.groupId!, currentAnswerContext.room.withRandom, answeredQuestionIds)
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
      next: await getNextQuestionToAnswerQuery(data.roomId),
      result: {
        id: currentAnswerContext.question?.id!,
        title : currentAnswerContext.question?.title || `Question ${currentAnswerContext.order}`,
        hasGood : withResult ? achievement === 100 : null,
        correction: currentAnswerContext.room.withCorrection ? goodResponseIds : null
      }
    }
  }
}

const canAnswerQuestion = async (roomId: string, questionId: string, userId?: string, shareLink?: string) => {
  const result = await prisma.answer.findFirstOrThrow({
    where: {
      questionId: questionId,
      dateEnd: null,
      room:{
        id: roomId,
        dateEnd: null,
        AND:{
          OR: [
            {
              userId: userId,
            },
            {
              shareLink: shareLink ?? '',
            },
          ]
        }
      }
    },
    select: {
      id: true,
      order: true,
      room:{
        select:{
          groupId: true,
          mode: true,
          withCorrection: true,
          withRandom: true
        }
      },
      question:{
        select: {
          id: true,
          title: true,
          responses:{
            where:{
              isCorrect: true
            },
            select:{
              id: true,
            }
          }
        }
      }
    }
  })

  return result!
}

const getAnsweredQuestionIdsInRoom = async (roomId: string) => {
  const questionIds = await prisma.answer.findMany({
    where: {
      roomId: roomId,
    },
    select:{
      questionId: true,
    },
  })

  return questionIds.map(q => q.questionId!)
}
