import { RoomDisplay, RoomMode } from '@prisma/client'
import * as z from 'zod'

// See schema.prisma

export const ResponseSchema = z.object({
  id: z.string().nullable(),
  text: z.string().min(2, 'At least 2 characters expected').max(250).or(z.literal('')),
  isCorrect: z.boolean(),
})

export const QuestionSchema = z.object({
  id: z.string().nullable(),
  title: z.string().max(100).nullish(),
  subject: z.string().min(10, 'At least 10 characters expected'),
  order: z.number(),
  responses: z.array(ResponseSchema).min(2),
})

// Used for editor form
export const QuestionFormSchema = z.object({
  id: z.string().nullable(),
  title: z.string().max(100).optional(),
  subject: z.string().min(10, 'At least 10 characters expected'),
  responses: z.array(ResponseSchema).min(2),
})

export const QuestionGroupSchema = z.object({
  id: z.string().nullable(),
  name: z.string().min(2).max(50),
  questions: z.array(QuestionSchema).min(1),
})

export const RoomSettingsSchema = z.object({
  groupId: z.string(),
  display: z.nativeEnum(RoomDisplay),
  mode: z.nativeEnum(RoomMode),
  withTimer: z.boolean(),
  withRandom: z.boolean(),
  withCorrection: z.boolean(),
  withResults: z.boolean(),
})

export const AnswerRoomSchema = z.object({
  roomId: z.string(),
  questionId: z.string(),
  shareLink: z.string().optional(),
  choices: z.array( z.string())
})

export type AnswerRoomReturnType = {
  order: number,
  questionId: string,
  subject: string,
  title: string | null,
  responses: { id: string, text: string} []
}

export type ResponseType = z.infer<typeof ResponseSchema>
export type QuestionType = z.infer<typeof QuestionSchema>
export type QuestionGroupType = z.infer<typeof QuestionGroupSchema>
export type QuestionFormType = z.infer<typeof QuestionFormSchema>
export type RoomSettingsType = z.infer<typeof RoomSettingsSchema>
export type AnswerRoomType = z.infer<typeof AnswerRoomSchema>
