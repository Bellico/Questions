import { commonNames, swNames } from '@/lib/collection-names'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 } from 'uuid'
import { ZodType } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000))

export type ActionResultType<T> = {
  success: boolean
  message?: string
  data?: T
  errors?: unknown
  errorFormat?: unknown
  issues?: unknown
}

export const ZparseOrError = <T extends ZodType>(
  schema: T,
  value: unknown,
): void | ActionResultType<any> => {
  const validatedFields = schema.safeParse(value)

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validatedFields.error.flatten().fieldErrors,
      errorFormat: validatedFields.error.format(),
      issues: validatedFields.error.issues,
    }
  }
}

export const mapToArray = <T>(map: Map<string, T>): T[] =>
  Array.from(map, ([_, value]) => value)

export const arrayToMap = <T>(datas: T[]) =>
  new Map<string, T>(datas.map((e) => [v4(), e]))

export const randomSwName = () => swNames[Math.floor(Math.random() * swNames.length)]

export const randomCommonName = () => commonNames[Math.floor(Math.random() * commonNames.length)]

export function generateRandomGroup(questionCount: number = 6, responsesCount: number = 4){
  let questions = []
  for (let q = 0; q < questionCount; q++) {

    let responses = []
    for (let r = 0; r < responsesCount; r++) {
      const isGood = (q + r) % 2 == 0
      responses.push({
        id: null,
        text: (isGood ? 'Good Response ' : 'Bad Response ') + randomSwName(),
        isCorrect: isGood
      })
    }

    questions.push({
      id: null,
      order: q + 1,
      subject: 'Question ' + randomCommonName(),
      responses
    })
  }

  return arrayToMap(questions)
}
