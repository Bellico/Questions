import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { RoomQuestionNextType } from '@/lib/schema'

export const getSessionUserId = async (): Promise<string | undefined> => {
  const session = await auth()

  return session?.user?.id
}

export const getSessionUserIdOrThrow = async (): Promise<string> => {
  const session = await auth()

  if (!session) {
    throw new Error('401 Unauthorized')
  }

  return session.user.id!
}

export const isGroupOwner = async (groupId: string, userId: string): Promise<boolean> => {
  const isOwner = await prisma.questionGroup.count({
    where: {
      id: groupId,
      authorId: userId
    }
  })

  return isOwner === 1
}

export const canPlayRoomQuery = async (roomId: string, userId?: string, shareLink?: string) => {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
      dateStart:{
        not: null
      },
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
    },
    select: {
      id: true,
      groupId: true,
      mode: true,
      withRandom: true,
      withProgress: true
    }
  })
}

export const getNextQuestionToAnswerQuery = async (roomId: string) : Promise<RoomQuestionNextType | null> => {
  const result = await prisma.answer.findFirst({
    where: {
      roomId: roomId,
      dateEnd: null,
    },
    select: {
      order: true,
      question:{
        select: {
          id: true,
          title: true,
          subject: true,
          responses:{
            select:{
              id: true,
              text: true
            }
          }
        }
      }
    }
  })

  if(result?.question){
    return{
      questionId : result.question.id,
      title: result?.question?.title || `Question ${result.order}`,
      subject: result.question.subject,
      responses: result.question.responses,
    }
  }

  return null
}

export const getActiveRoomQuery = async (groupId: string, userId: string) => {
  return await prisma.room.findFirst({
    where: {
      groupId: groupId,
      userId: userId,
      dateEnd: null,
      dateStart: {
        gte: new Date(new Date().getTime() - 3600 * 1000),
      }
    },
    select: {
      id: true
    }
  })
}
