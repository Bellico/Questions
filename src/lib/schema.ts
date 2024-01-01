import * as z from "zod";

// See schema.prisma

export const ResponseSchema = z.object({
    id: z.string().optional(),
    text: z.string(),
    isCorrect: z.boolean()
})

export const QuestionSchema = z.object({
    id: z.string(),
    subject: z.string(),
    responses: z.array(ResponseSchema)
})

export const QuestionGroupSchema = z.object({
    id: z.string(),
    name: z.string().max(50),
    questions: z.array(QuestionSchema)
})

export type ResponseType = z.infer<typeof ResponseSchema>;
export type QuestionType = z.infer<typeof QuestionSchema>;
export type QuestionGroupType = z.infer<typeof QuestionGroupSchema>;
