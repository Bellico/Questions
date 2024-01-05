import * as z from "zod";

// See schema.prisma

export const ResponseSchema = z.object({
    id: z.string().nullable(),
    text: z.string().min(2, 'At least 2 characters expected').or(z.literal('')),
    isCorrect: z.boolean()
})

export const QuestionSchema = z.object({
    id: z.string().nullable(),
    subject: z.string().min(10, 'At least 10 characters expected'),
    responses: z.array(ResponseSchema).min(2)
})

export const QuestionGroupSchema = z.object({
    id: z.string().nullable(),
    name: z.string().max(50),
    questions: z.array(QuestionSchema)
})

export type ResponseType = z.infer<typeof ResponseSchema>;
export type QuestionType = z.infer<typeof QuestionSchema>;
export type QuestionGroupType = z.infer<typeof QuestionGroupSchema>;
