import { RoomMode } from '@prisma/client'
import * as z from 'zod'

// See schema.prisma

export const ResponseSchema = z.object({
  id: z.string().nullable(),
  text: z.string().min(2, 'At least 2 characters expected').max(550).or(z.literal('')),
  isCorrect: z.boolean(),
})

export const QuestionSchema = z.object({
  id: z.string().nullable(),
  title: z.string().max(100).nullable(),
  subject: z.string().min(10, 'At least 10 characters expected'),
  order: z.number(),
  responses: z.array(ResponseSchema).min(2),
})

// Used for editor form
export const QuestionFormSchema = z.object({
  id: z.string().nullable(),
  title: z.string().max(100),
  subject: z.string().min(10, 'At least 10 characters expected'),
  responses: z.array(ResponseSchema).min(2),
})

export const QuestionGroupSchema = z.object({
  id: z.string().nullable(),
  name: z.string().min(2).max(50),
  questions: z.array(QuestionSchema).min(1),
})

const RoomSettingsBaseSchema = z.object({
  groupId: z.string(),
  mode: z.nativeEnum(RoomMode),
  withRetry: z.coerce.number().min(0).max(3),
  withRandom: z.boolean(),
  withCorrection: z.boolean(),
  withResults: z.boolean(),
  withProgress: z.boolean(),
  withProgressState: z.boolean(),
  withNavigate: z.boolean()
})

export const RoomSettingsSchema = RoomSettingsBaseSchema
  .refine(v => v.mode === RoomMode.Rating && v.withCorrection ? false: true)
  .refine(v => v.withProgressState && !v.withProgress ? false : true )

export const RoomShareSchema = z.object({
  usermail: z.string().email(),
}).merge(RoomSettingsBaseSchema)
  .refine(v => v.mode === RoomMode.Rating && v.withCorrection ? false: true)
  .refine(v => v.withProgressState && !v.withProgress ? false : true )

export const RoomStartSchema = z.object({
  roomId: z.string(),
  shareLink: z.string().optional(),
})

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

export const UserSettingsSchema = z.object({
  locale: z.string().length(2),
  username: z.string().min(3).nullable().or(z.literal('')),
  usePassword: z.boolean(),
  password: z.string().min(8).nullish().or(z.literal('')),
})

export const GroupUsersSchema = z.object({
  groupId: z.string(),
  userIdsToShared: z.array(z.string())
})

export type ResponseType = z.infer<typeof ResponseSchema>
export type QuestionType = z.infer<typeof QuestionSchema>
export type QuestionGroupType = z.infer<typeof QuestionGroupSchema>
export type QuestionFormType = z.infer<typeof QuestionFormSchema>
export type RoomSettingsType = z.infer<typeof RoomSettingsSchema>
export type RoomShareType = z.infer<typeof RoomShareSchema>
export type RoomStartType = z.infer<typeof RoomStartSchema>
export type AnswerRoomType = z.infer<typeof AnswerRoomSchema>
export type PrevNextRoomType = z.infer<typeof PrevNextRoomSchema>
export type UserSettingsType = z.infer<typeof UserSettingsSchema>
export type GroupUsersType = z.infer<typeof GroupUsersSchema>

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
