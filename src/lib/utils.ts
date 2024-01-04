import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 } from 'uuid';
import { ZodType } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

export type ActionErrorType = {
  message: string,
  errors?: unknown
}

export const ZparseOrError = <T extends ZodType>(schema: T, value: unknown): void | ActionErrorType => {
  const validatedFields = schema.safeParse(value);

  if (!validatedFields.success) {
    return {
      message: "Failed to parse data",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
}

export const mapToArray = <T>(map: Map<string, T>): T[] => Array.from(map, ([_, value]) => value)

export const arrayToMap = <T>(datas: T[]) => new Map<string, T>(datas.map(e => [v4(), e]));
