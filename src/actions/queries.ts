import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { RoomProgressType, RoomQuestionNextType } from '@/lib/schema'
import { RoomMode } from '@prisma/client'

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

export const getGroupName = async (groupId: string): Promise<string> => {
  const group = await prisma.questionGroup.findUniqueOrThrow({
    where: {
      id: groupId,
    }
  })

  return group.name
}

export const getGroupsListQuery = async (userId: string) => {
  const groupList =  await prisma.questionGroup.findMany({
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

  const groupIds = groupList.map(g => g.id)

  const resultsCountByGroup = await prisma.room.groupBy({
    by: ['groupId'],
    where: {
      mode: 'Rating',
      dateEnd: {
        not: null
      },
      groupId: {
        in: groupIds
      },
    },
    _count: true,
  })

  const lastScoreByGroup = await prisma.questionGroup.findMany({
    where: {
      id: {
        in: groupIds
      },
    },
    select:{
      id: true,
      rooms: {
        where:{
          mode: 'Rating',
          userId: userId,
          dateEnd: {
            not: null
          },
        },
        orderBy : {
          dateEnd: 'desc'
        },
        take: 1,
        select:{
          score: true,
          dateEnd: true
        }
      }
    }
  })

  return groupList.map(g => ({
    id: g.id,
    name: g.name,
    version: g.version,
    questionsCount : g._count.questions,
    resultsCount: resultsCountByGroup.find(rc => rc.groupId === g.id)?._count ?? 0,
    lastTryDate: lastScoreByGroup.find(sc => sc.id === g.id)?.rooms[0]?.dateEnd ?? null,
    lastScore: lastScoreByGroup.find(sc => sc.id === g.id)?.rooms[0]?.score ?? null,
  }))
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

  const roomScore = await prisma.room.aggregate({
    where: {
      userId: userId,
      mode: RoomMode.Rating,
    },
    _count: true,
    _avg: {
      score: true
    }
  })

  const answerCount = await prisma.answer.count({
    where: {
      room:{
        userId: userId,
        mode: RoomMode.Rating,
      }
    }
  })

  const answerFailedCount = await prisma.answer.count({
    where: {
      achievement:{
        lt: 100
      },
      room:{
        userId: userId,
        mode: RoomMode.Rating,
      }
    }
  })

  const [{ round: avgAnwserTime }] = await prisma.$queryRaw`
    SELECT ROUND(AVG(
      ((DATE_PART('day', a."dateEnd"::timestamp - a."dateStart"::timestamp) * 24 +
      DATE_PART('hour', a."dateEnd"::timestamp - a."dateStart"::timestamp)) * 60 +
      DATE_PART('minute', a."dateEnd"::timestamp - a."dateStart"::timestamp)) * 60 +
      DATE_PART('second', a."dateEnd"::timestamp - a."dateStart"::timestamp)
    )) FROM "Answer" a
       INNER JOIN "Room" r ON a."roomId" = r."id"
       WHERE r."userId" = ${userId}
       AND r."mode"::text = ${RoomMode.Rating}` as [{ round : number}]

  const [{ round: totalTime }] = await prisma.$queryRaw`
    SELECT ROUND(SUM(
      ((DATE_PART('day', "dateEnd"::timestamp - "dateStart"::timestamp) * 24 +
      DATE_PART('hour', "dateEnd"::timestamp - "dateStart"::timestamp)) * 60 +
      DATE_PART('minute', "dateEnd"::timestamp - "dateStart"::timestamp)) * 60 +
      DATE_PART('second', "dateEnd"::timestamp - "dateStart"::timestamp)
    )) FROM "Room"
       WHERE "Room"."userId" = ${userId}
       AND "Room"."mode"::text = ${RoomMode.Rating}` as [{ round : number}]

  return {
    avgScore: roomScore._avg.score !== null ? Math.round(roomScore._avg.score) : null,
    roomCount: roomScore._count,
    groupCount,
    questionCount,
    answerCount,
    answerFailedCount,
    avgAnwserTime,
    totalTime
  }
}

export const getGroupStatsQuery = async (userId: string, groupId: string) => {
  const groupCount = 1

  const questionCount = await prisma.question.count({
    where: {
      groupId: groupId
    }
  })

  const roomScore = await prisma.room.aggregate({
    where: {
      userId: userId,
      groupId: groupId,
      mode: RoomMode.Rating,
    },
    _count: true,
    _avg: {
      score: true
    }
  })

  const answerCount = await prisma.answer.count({
    where: {
      room:{
        userId: userId,
        groupId: groupId,
        mode: RoomMode.Rating,
      }
    }
  })

  const answerFailedCount = await prisma.answer.count({
    where: {
      achievement:{
        lt: 100
      },
      room:{
        userId: userId,
        groupId: groupId,
        mode: RoomMode.Rating,
      }
    }
  })

  const [{ round: avgAnwserTime }] = await prisma.$queryRaw`
    SELECT ROUND(AVG(
      ((DATE_PART('day', a."dateEnd"::timestamp - a."dateStart"::timestamp) * 24 +
      DATE_PART('hour', a."dateEnd"::timestamp - a."dateStart"::timestamp)) * 60 +
      DATE_PART('minute', a."dateEnd"::timestamp - a."dateStart"::timestamp)) * 60 +
      DATE_PART('second', a."dateEnd"::timestamp - a."dateStart"::timestamp)
    )) FROM "Answer" a
       INNER JOIN "Room" r ON a."roomId" = r."id"
       WHERE r."userId" = ${userId}
       AND r."mode"::text = ${RoomMode.Rating}
       AND r."groupId" = ${groupId}` as [{ round : number}]

  const [{ round: totalTime }] = await prisma.$queryRaw`
    SELECT ROUND(SUM(
      ((DATE_PART('day', "dateEnd"::timestamp - "dateStart"::timestamp) * 24 +
      DATE_PART('hour', "dateEnd"::timestamp - "dateStart"::timestamp)) * 60 +
      DATE_PART('minute', "dateEnd"::timestamp - "dateStart"::timestamp)) * 60 +
      DATE_PART('second', "dateEnd"::timestamp - "dateStart"::timestamp)
    )) FROM "Room"
       WHERE "Room"."userId" = ${userId}
       AND "Room"."mode"::text = ${RoomMode.Rating}
       AND "Room"."groupId" = ${groupId}` as [{ round : number}]

  return {
    avgScore: roomScore._avg.score !== null ? Math.round(roomScore._avg.score) : null,
    roomCount: roomScore._count,
    groupCount,
    questionCount,
    answerCount,
    answerFailedCount,
    avgAnwserTime,
    totalTime
  }
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
      withRandom: true,
      withRetry: true,
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
        withRetry: true,
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
    withRetry: 0,
    withRandom: false,
    withCorrection: false,
    withResults: false,
    withProgress: false,
  }

  return {...settings, withRetry: settings.withRetry ?? 0, groupId}
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
      withResults: true,
      withRetry: true
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
export const canRetryRoomQuery = async (roomId: string, userId?: string, shareLink?: string) => {
  return await prisma.room.findFirstOrThrow({
    where: {
      id: roomId,
      dateEnd: {
        not: null
      },
      withRetry: {
        gt: 0
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
      groupId: true,
      withRandom: true,
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

export const getRoomListQuery = async (groupId: string) => {
  return await prisma.room.findMany({
    where: {
      groupId: groupId,
      mode: 'Rating',
      dateEnd:{
        not : null
      }
    },
    orderBy: {
      dateStart: 'desc',
    },
    select:{
      id: true,
      score: true,
      successCount: true,
      failedCount: true,
      dateStart: true,
      dateEnd: true,
      withRetry: true,
      user: {
        select: {
          id: true,
          email: true
        }
      }
    }
  })
}
