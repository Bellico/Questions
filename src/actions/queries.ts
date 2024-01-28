import prisma from '@/lib/prisma'

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
