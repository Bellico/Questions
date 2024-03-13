'use server'

import { createQuestionGroupAction } from '@/actions/editor/create-question-group-action'
import { getSessionUserIdOrThrow, isGroupOwnerOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { ActionResultType, ZparseOrError } from '@/lib/utils'
import z from 'zod'

export const duplicateQuestionGroupAction = async (id: string): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(z.string(), id)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
  await isGroupOwnerOrThrow(id, userId)

  const source = await prisma.questionGroup.findUniqueOrThrow({
    where: {
      id: id,
      authorId: userId,
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
  return await createQuestionGroupAction(source)
}
