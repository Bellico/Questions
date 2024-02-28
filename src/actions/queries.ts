import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { RoomProgressType, RoomQuestionNextType } from '@/lib/schema'

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

export const getGroupForStartQuery = async (groupId: string, userId: string) => {
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

export const getGroupForShareQuery = async (groupId: string, shareLink: string) => {
  return await prisma.room.findUnique({
    where: {
      id: groupId,
      shareLink: shareLink,
      dateEnd: null
    },
    select: {
      id: true,
      dateStart: true,
      mode: true,
      group:{
        include:{
          _count: {
            select: { questions: true },
          },
        }
      }
    }
  })
}

export const getLastSettingsRoomQuery = async (groupId: string, userId: string) => {
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
      mode: true,
      withTimer: true,
      withRandom: true,
      withCorrection: true,
      withResults: true,
      withProgress: true
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
        mode: true,
        withTimer: true,
        withRandom: true,
        withCorrection: true,
        withResults: true,
        withProgress: true
      }
    })
  }

  // Or Default
  if(!settings) return {
    groupId: groupId,
    mode: 'Training' as 'Training' | 'Rating',
    withTimer: false,
    withRandom: false,
    withCorrection: false,
    withResults: false,
    withProgress: false,
  }

  return {...settings, groupId}
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

export const getProgressInfosRoomQuery = async (roomId: string, groupId: string, withResult: boolean) : Promise<RoomProgressType[]> => {
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
      roomId: roomId,
      dateEnd:{
        not : null
      }
    },
    select: {
      questionId: true,
      achievement: true,
    }
  })

  const progress = questions.map((q, i) => {
    const answer = answers.find(a => a.questionId === q.id)

    return {
      id: q.id,
      title: q.title || `Question ${i + 1}`,
      hasGood : withResult && answer ? answer.achievement === 100 : null,
      isAnswer : !!answer,
    }
  })

  return progress
}

export const getProgressInfosWithRandomQuery = async (roomId: string, groupId: string, withResult: boolean) : Promise<RoomProgressType[]> => {
  const questions = await prisma.question.count({
    where: {
      groupId: groupId
    }
  })

  const answers = await prisma.answer.findMany({
    where: {
      roomId: roomId,
    },
    select: {
      questionId: true,
      achievement: true,
      question:{
        select:{
          id: true,
          title: true
        }
      }
    },
    orderBy:{
      order: 'asc'
    }
  })

  // Already knows
  const progress = answers.map((answer, i) => ({
    id: answer.questionId,
    title: answer?.question?.title || `Question ${i + 1}`,
    hasGood: withResult && answer.achievement !== null ? answer.achievement === 100 : null,
    isAnswer: answer.achievement !== null,
  }))

  // Fill next questions
  for (let i = progress.length ; i < questions; i++) {
    progress.push({
      id: null,
      title: `Question ${i + 1}`,
      hasGood: null,
      isAnswer: false,
    })
  }

  return progress
}

export const canViewRoomQuery = async (roomId: string, userId?: string, shareLink?: string) => {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
      dateEnd: {
        not: null
      },
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
      withResults: true
    }
  })
}

export const getRoomFinalScoreQuery = async (roomId: string) => {
  const results = await prisma.room.findFirstOrThrow({
    where:{
      id: roomId,
      dateEnd: {
        not: null
      }
    },
    select:{
      score: true,
      successCount: true,
      failedCount: true
    }
  })

  return {
    score: results.score,
    success: results.successCount,
    failed: results.failedCount,
    count : results.successCount! +  results.failedCount!
  }
}

export const getRoomFinalResumeQuery = async (roomId: string) => {
  return await prisma.answer.findMany({
    where:{
      roomId: roomId,
      dateEnd: {
        not: null
      }
    },
    select:{
      id: true,
      achievement: true,
      order: true,
      choices:{
        select:{
          responseId: true
        }
      },
      question:{
        select:{
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
      },
    },
    orderBy:{
      order:'asc'
    }
  })
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

export const computeNextQuestionQuery = async (groupId: string, withRandom: boolean, alreadyAnsweredQuestionId: string[]) => {
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
