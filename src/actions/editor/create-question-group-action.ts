'use server'

import { getSessionUserIdOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { QuestionGroupSchema, QuestionGroupType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const createQuestionGroupAction = async (data: QuestionGroupType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(QuestionGroupSchema, data)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()

  try {
    const group = await prisma.questionGroup.create({
      data: {
        name: data.name,
        creationDate: new Date(),
        updateDate: new Date(),
        version: 1,
        authorId: userId,
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
