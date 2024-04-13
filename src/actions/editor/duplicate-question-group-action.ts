'use server'

import { createQuestionGroupAction } from '@/actions/editor/create-question-group-action'
import { ActionResultType, withValidateAndSession } from '@/actions/wrapper-actions'
import prisma from '@/lib/prisma'
import { isGroupOwnerOrThrow } from '@/queries/actions-queries'
import z from 'zod'

export const duplicateQuestionGroupAction = withValidateAndSession(
  z.string(),
  async (id: string, userId: string): Promise<ActionResultType<string>> => {

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

    source.name = 'Copy of ' + source.name
    return await createQuestionGroupAction(source)
  })
