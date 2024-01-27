'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { QuestionGroupSchema, QuestionGroupType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import z from 'zod'

export const createQuestionGroup = async (data: QuestionGroupType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(QuestionGroupSchema, data)
  if (errors) return errors

  const session = await auth()

  if (!session) {
    throw new Error('401 Unauthorized')
  }

  try {
    const group = await prisma.questionGroup.create({
      data: {
        name: data.name,
        creationDate: new Date(),
        updateDate: new Date(),
        version: 1,
        authorId: session.user.id!,
        questions: {
          create: data.questions.map(q => {
            return {
              title: q.title,
              subject: q.subject,
              order: q.order,
              responses: {
                create: q.responses.filter(r => !!r.text).map(r => ({
                  isCorrect: r.isCorrect,
                  text: r.text
                }))
              }
            }
          })
        }
      },
    })

    revalidatePath('/board')

    return {
      success: true,
      data: group.id
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to create questions group: ' + error.message,
    }
  }
}

export const updateQuestionGroup = async (data: QuestionGroupType): Promise<ActionResultType<void>> => {
  const errors = ZparseOrError(QuestionGroupSchema, data)
  if (errors) return errors

  const session = await auth()

  if (!session) {
    throw new Error('401 Unauthorized')
  }

  var isOwner = await prisma.questionGroup.count({
    where: {
      id: data.id!,
      authorId: session.user.id!
    }
  })

  if (isOwner == 0) {
    throw new Error('403 Forbidden')
  }

  try {
    await prisma.$transaction(async (tx) => {

      // 1. Update group
      await prisma.questionGroup.update({
        where: {
          id: data.id!,
        },
        data: {
          name: data.name,
          updateDate: new Date(),
          version: { increment: 1 }
        },
      })

      // 2. Delete old Questions
      const questionIdToKeep = data.questions.filter(q => !!q.id).map(q => q.id!)
      await prisma.question.deleteMany({
        where: {
          id: {
            notIn: questionIdToKeep
          },
          groupId: {
            equals: data.id!
          }
        },
      })

      // 3. Update existing Questions Or Create New With Responses
      for (let i = 0; i < data.questions.length; i++) {
        const q = data.questions[i]

        await prisma.question.upsert({
          where: {
            id: q.id || '0'
          },
          create: {
            groupId: data.id!,
            title: q.title,
            subject: q.subject,
            order: q.order,
            responses: {
              create: q.responses.filter(r => !!r.text).map(r => ({
                isCorrect: r.isCorrect,
                text: r.text
              }))
            }
          },
          update: {
            title: q.title,
            order: q.order,
            subject: q.subject
          }
        })
      }

      // 4. Create / Update / Delete Responses for Updated Questions
      const updatedQuestion = data.questions.filter(q => !!q.id)
      for (let i = 0; i < updatedQuestion.length; i++) {

        const q = updatedQuestion[i]
        // Delete
        await prisma.response.deleteMany({
          where: {
            id: {
              notIn: q.responses.filter(r => !!r.id).map(r => r.id!)
            },
            questionId: {
              equals: q.id!
            }
          }
        })

        for (let j = 0; j < q.responses.length; j++) {

          const r = q.responses[j]
          if (!r.text) continue

          await prisma.response.upsert({
            where: {
              id: r.id || '0'
            },
            create: {
              questionId: q.id!,
              text: r.text,
              isCorrect: r.isCorrect
            },
            update: {
              text: r.text,
              isCorrect: r.isCorrect
            },
          })
        }
      }
    }, {
      timeout: 5000
    })

    revalidatePath('/board/')

    return {
      success: true
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to update questions group: ' + error.message,
    }
  }
}

export const deleteQuestionGroup = async (id: string): Promise<ActionResultType<void>> => {
  const errors = ZparseOrError(z.string(), id)
  if (errors) return errors

  const session = await auth()

  if (!session) {
    throw new Error('401 Unauthorized')
  }

  var isOwner = await prisma.questionGroup.count({
    where: {
      id: id,
      authorId: session.user.id!
    }
  })

  if (isOwner == 0) {
    throw new Error('403 Forbidden')
  }

  try {
    await prisma.questionGroup.delete({
      where: {
        id: id
      }
    })

    revalidatePath('/board')

    return {
      success: true
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to delete questions group: ' + error.message,
    }
  }
}

export const duplicateQuestionGroup = async (id: string): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(z.string(), id)
  if (errors) return errors

  const session = await auth()

  if (!session) {
    throw new Error('401 Unauthorized')
  }

  const source = await prisma.questionGroup.findUniqueOrThrow({
    where: {
      id: id,
      authorId: session.user.id!,
    },
    select: {
      id: true,
      name: true,
      questions: {
        select: {
          id: true,
          title: true,
          subject: true,
          order: true,
          responses: {
            select:
                        {
                          id: true,
                          text: true,
                          isCorrect: true
                        }
          }
        }
      }
    },
  })

  source.name = 'Copy of ' + source.name
  return await createQuestionGroup(source)
}
