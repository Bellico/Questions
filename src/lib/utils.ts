import { commonNames, swNames } from '@/lib/collection-names'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodType } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ArrayType<T> = T extends (infer Item)[] ? Item : T

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
  new Map<string, T>(datas.map((e) => [crypto.randomUUID(), e]))

export const findIndexOfKeyMap = (map: Map<string, unknown>, key: string) =>  {
  let index = 0
  for (const [mapKey, _] of map) {
    if (mapKey === key) {
      return index
    }
    index++
  }
  return -1
}

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
      title: null,
      subject: 'Question ' + randomCommonName(),
      responses
    })
  }

  return arrayToMap(questions)
}

export function computeScore(results: number[]){
  const success = results.filter(r => r === 100).length

  return {
    score: Math.round((success * 100) / results.length),
    success,
    failed: results.filter(r => r < 100).length,
  }
}

export function diffDateToDhms(start : Date, end: Date) {
  return secondsToDhms(end.getTime() / 1000 - start.getTime() / 1000)
}

export function secondsToDhms(seconds : number) {
  var d = Math.floor(seconds / (3600*24))
  if(d > 0) return d + (d == 1 ? ' day' : ' days')

  var h = Math.floor(seconds % (3600*24) / 3600)
  if(h > 0) return h + (h == 1 ? ' hour' : ' hours')

  var m = Math.floor(seconds % 3600 / 60)
  if(m > 0) return m + (m == 1 ? ' minute' : ' minutes')

  var s = Math.floor(seconds % 60)
  return s + (s == 1 ? ' second' : ' seconds')
}

export async function downloadBlob(res: Response) {
  const disposition = res.headers.get('Content-Disposition')
  const fileName = disposition!.split('filename=')[1].split(';')[0] ?? 'file'
  // const blob = new Blob([blob], { type: contentType! })
  const blob = await res.blob()

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  link.click()
}
