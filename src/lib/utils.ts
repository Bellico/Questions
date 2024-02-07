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

const swNames = [
  'Ackbar',
  'Adi Gallia',
  'Anakin Skywalker',
  'Arvel Crynyd',
  'Ayla Secura',
  'Bail Prestor Organa',
  'Barriss Offee',
  'Ben Quadinaros',
  'Beru Whitesun lars',
  'Bib Fortuna',
  'Biggs Darklighter',
  'Boba Fett',
  'Bossk',
  'C-3PO',
  'Chewbacca',
  'Cliegg Lars',
  'Cord\xe9',
  'Darth Maul',
  'Darth Vader',
  'Dexter Jettster',
  'Dooku',
  'Dorm\xe9',
  'Dud Bolt',
  'Eeth Koth',
  'Finis Valorum',
  'Gasgano',
  'Greedo',
  'Gregar Typho',
  'Grievous',
  'Han Solo',
  'IG-88',
  'Jabba Desilijic Tiure',
  'Jango Fett',
  'Jar Jar Binks',
  'Jek Tono Porkins',
  'Jocasta Nu',
  'Ki-Adi-Mundi',
  'Kit Fisto',
  'Lama Su',
  'Lando Calrissian',
  'Leia Organa',
  'Lobot',
  'Luke Skywalker',
  'Luminara Unduli',
  'Mace Windu',
  'Mas Amedda',
  'Mon Mothma',
  'Nien Nunb',
  'Nute Gunray',
  'Obi-Wan Kenobi',
  'Owen Lars',
  'Padm\xe9 Amidala',
  'Palpatine',
  'Plo Koon',
  'Poggle the Lesser',
  'Quarsh Panaka',
  'Qui-Gon Jinn',
  'R2-D2',
  'R4-P17',
  'R5-D4',
  'Ratts Tyerel',
  'Raymus Antilles',
  'Ric Oli\xe9',
  'Roos Tarpals',
  'Rugor Nass',
  'Saesee Tiin',
  'San Hill',
  'Sebulba',
  'Shaak Ti',
  'Shmi Skywalker',
  'Sly Moore',
  'Tarfful',
  'Taun We',
  'Tion Medon',
  'Wat Tambor',
  'Watto',
  'Wedge Antilles',
  'Wicket Systri Warrick',
  'Wilhuff Tarkin',
  'Yarael Poof',
  'Yoda',
  'Zam Wesell',
]
export const randomSwName = () =>
  swNames[Math.floor(Math.random() * swNames.length)]
