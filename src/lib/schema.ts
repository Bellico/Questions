import { RoomMode } from '@prisma/client'
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
  mode: z.nativeEnum(RoomMode),
  withTimer: z.boolean(),
  withRandom: z.boolean(),
  withCorrection: z.boolean(), // => Training ?
  withResults: z.boolean(),
  withProgress: z.boolean()
}).refine(v => v.mode === RoomMode.Rating && v.withCorrection ? false: true)

export const AnswerRoomSchema = z.object({
  roomId: z.string(),
  questionId: z.string(),
  shareLink: z.string().optional(),
  choices: z.array(z.string())
})

export const PrevNextRoomSchema = z.object({
  roomId: z.string(),
  questionId: z.string().nullable(),
  shareLink: z.string().optional()
})

export type ResponseType = z.infer<typeof ResponseSchema>
export type QuestionType = z.infer<typeof QuestionSchema>
export type QuestionGroupType = z.infer<typeof QuestionGroupSchema>
export type QuestionFormType = z.infer<typeof QuestionFormSchema>
export type RoomSettingsType = z.infer<typeof RoomSettingsSchema>
export type AnswerRoomType = z.infer<typeof AnswerRoomSchema>
export type PrevNextRoomType = z.infer<typeof PrevNextRoomSchema>

export type RoomQuestionNextType = {
  questionId: string,
  subject: string,
  title: string,
  responses: { id: string, text: string} [],

  navigate?: {
    hasGood: boolean,
    choices: string[]
    correction: string[] | null,
  }
}

export type RoomProgressType = {
  id: string | null,
  title: string,
  isAnswer: boolean,
  hasGood: boolean | null,
}

export type RoomQuestionResultType = {
  id: string,
  title: string,
  hasGood: boolean | null,
  correction: string[] | null,
}

export type AnswerRoomReturnType = {
  next: RoomQuestionNextType | null,
  result: RoomQuestionResultType
}
