import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const getSessionUserIdOrThrow = async (): Promise<string> => {
  const session = await auth()

  if (!session) {
    throw new Error('401 Unauthorized')
  }

  return session.user.id!
}

export const getSessionUserId = async (): Promise<string | undefined> => {
  const session = await auth()

  return session?.user?.id
}

export const isGroupOwnerOrThrow = async (groupId: string, userId: string): Promise<boolean> => {
  const isOwner = await prisma.questionGroup.count({
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
  // Last setting of same group
  let settings = await prisma.room.findFirst({
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

  // if not any last settings
  if(!settings){
    settings = await prisma.room.findFirst({
      where: {
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
  }

  // Or Default
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
      order: result.order,
      title: result.question.title,
      subject: result.question.subject,
      responses: result.question.responses,
    }
  }

  return null
}

export const getProgressInfosRoom = async (roomId: string, groupId: string) => {
  const questions = await prisma.question.findMany({
    where: {
      groupId: groupId
    },
    select: {
      id: true,
      title: true
    },
    orderBy:{
      order: 'asc'
    }
  })

  const answers = await prisma.answer.findMany({
    where: {
      roomId: roomId
    },
    select: {
      questionId: true,
      achievement: true,
    }
  })

  const progress = questions.map((q, i) => {
    const answer = answers.find(a => a.questionId == q.id)
    return {
      ...q,
      title: q.title || `Question ${i + 1}`,
      isSuccess : answer?.achievement === 100}
  })

  return progress
}

export const canAnswerQuestion = async (roomId: string, questionId: string, userId?: string, shareLink?: string) => {
  const result = await prisma.answer.findFirstOrThrow({
    where: {
      questionId: questionId,
      dateEnd: null,
      room:{
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
      }
    },
    select: {
      id: true,
      order: true,
      room:{
        select:{
          groupId: true,
          withRandom: true
        }
      },
      question:{
        select: {
          id: true,
          title: true,
          responses:{
            select:{
              id: true,
              isCorrect: true
            }
          }
        }
      }
    }
  })

  return result!
}

export const getAnsweredQuestionIdsInRoom = async (roomId: string) => {
  const questionIds = await prisma.answer.findMany({
    where: {
      roomId: roomId,
      dateEnd: {
        not: null
      }
    },
    select:{
      questionId: true,
    },
  })

  return questionIds.map(q => q.questionId!)
}

export const computeNextQuestion = async (groupId: string, withRandom: boolean, alreadyAnsweredQuestionId: string[]) => {
  const availableQuestions = await prisma.question.findMany({
    where: {
      id: {
        notIn: alreadyAnsweredQuestionId
      },
      groupId: groupId
    },
    select:{
      id: true,
    },
    orderBy:{
      order: 'asc'
    }
  })

  if(availableQuestions.length === 0){
    return null
  }

  const questionIds = availableQuestions.map(q => q.id)
  let nextQuestionId = questionIds[0]

  if(withRandom){
    nextQuestionId = questionIds[Math.floor(Math.random() * questionIds.length)]
  }

  return nextQuestionId
}

export const canPlayRoom = async (roomId: string, userId?: string, shareLink?: string) => {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
      dateEnd: null,
      groupId:{
        not: null
      },
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
      groupId: true,
      display: true,
      withRandom: true,
    }
  })
}
