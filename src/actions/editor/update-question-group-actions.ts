'use server'

import { getSessionUserIdOrThrow, isGroupOwnerOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { QuestionGroupSchema, QuestionGroupType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const updateQuestionGroupAction = async (data: QuestionGroupType): Promise<ActionResultType<void>> => {
  const errors = ZparseOrError(QuestionGroupSchema, data)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
  await isGroupOwnerOrThrow(data.id!, userId)

  try {
    await prisma.$transaction(async (tx) => {

      // 1. Update group
      await tx.questionGroup.update({
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
      await tx.question.deleteMany({
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

        await tx.question.upsert({
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
        await tx.response.deleteMany({
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

          await tx.response.upsert({
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
      timeout: 15000
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
