import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { randomNextOrder } from '@/lib/utils'

export const getSessionUserId = async (): Promise<string> => {
  const session = await auth()

  if (!session) {
    throw new Error('401 Unauthorized')
  }

  return session.user.id!
}

export const isGroupOwner = async (groupId: string, userId: string): Promise<boolean> => {
  var isOwner = await prisma.questionGroup.count({
    where: {
      id: groupId,
      authorId: userId
    }
  })

  if (isOwner == 0) {
    throw new Error('403 Forbidden')
  }

  return true
}

export const getGroupsListQuery = async (userId: string) => {
  return await prisma.questionGroup.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      creationDate: 'desc',
    },
    include: {
      _count: {
        select: { questions: true },
      },
    }
  })
}

export const getEditorQuery = async (groupId: string, userId: string) => {
  return await prisma.questionGroup.findUnique({
    where: {
      id: groupId,
      authorId: userId,
    },
    select: {
      id: true,
      name: true,
      questions: {
        orderBy: {
          order: 'asc'
        },
        select: {
          id: true,
          title: true,
          subject: true,
          order: true,
          responses: {
            select: {
              id: true,
              text: true,
              isCorrect: true
            }
          }
        }
      }
    },
  })
}

export const getStatsQuery = async (userId: string) => {
  const groupCount = await prisma.questionGroup.count({
    where: {
      authorId: userId,
    }
  })

  const questionCount = await prisma.question.count({
    where: {
      group: {
        authorId: userId
      }
    }
  })

  return { groupCount, questionCount }
}

export const getGroupForStart = async (groupId: string, userId: string) => {
  return await prisma.questionGroup.findUnique({
    where: {
      id: groupId,
      authorId: userId,
    },
    include: {
      _count: {
        select: { questions: true },
      },
    }
  })
}

export const getLastSettingsRoom = async (groupId: string, userId: string) => {
  const settings =  await prisma.room.findFirst({
    where: {
      groupId: groupId,
      userId: userId,
    },
    orderBy:{
      dateStart: 'desc'
    },
    select:{
      display: true,
      mode: true,
      withTimer: true,
      withRandom: true,
      withCorrection: true,
      withResults: true
    }
  })

  if(!settings) return {
    groupId: groupId,
    display : 'Vertical' as 'Vertical' | 'Horizontal',
    mode: 'Training' as 'Training' | 'Rating',
    withTimer: false,
    withRandom: false,
    withCorrection: false,
    withResults: false,
  }

  return {...settings, groupId}
}

export const getActiveRoom = async (groupId: string, userId: string) => {
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

export const getNextQuestionToAnswer = async (roomId: string) => {
  return await prisma.answer.findFirst({
    where: {
      roomId: roomId,
      dateEnd: null,
    },
    select: {
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
}

export const computeNextQuestion = async (groupId: string, withRandom: boolean) => {
  const allOrderQuetion = await prisma.question.findMany({
    where: {
      groupId: groupId
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

  if(withRandom){
    const orders = allOrderQuetion.map(o => o.order)
    const firstOrderQuestion = randomNextOrder(orders, [])
    questionId = allOrderQuetion.find(o => o.order === firstOrderQuestion)?.id!
  }

  return questionId
}

export const canPlayRoom = async (roomId: string, userId: string, shareLink?: string) => {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
      dateEnd: null,
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
    },
    select: {
      id: true,
      display: true,
    }
  })
}
