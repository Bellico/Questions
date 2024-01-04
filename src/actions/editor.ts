'use server';

import prisma from "@/lib/prisma";
import { QuestionGroupSchema, QuestionGroupType } from "@/lib/schema";
import { ActionErrorType, ZparseOrError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createQuestionGroup = async (data: QuestionGroupType): Promise<string | ActionErrorType> => {
    const errors = ZparseOrError(QuestionGroupSchema, data)
    if (errors) return errors

    try {
        const group = await prisma.questionGroup.create({
            data: {
                name: data.name,
                creationDate: new Date(),
                questions: {
                    create: data.questions.map(q => {
                        return {
                            subject: q.subject,
                            responses: {
                                create: q.responses.map(r => ({
                                    isCorrect: r.isCorrect,
                                    text: r.text
                                }))
                            }
                        }
                    })
                }
            },
        });

        revalidatePath('/board')
        return redirect('/board')
    }
    catch (error: any) {
        console.log(error)
        return {
            message: "Database Error: Failed to Create questions.",
        };
    }
}

// const totest = (value: any) => {
//     const validatedFields = QuestionGroupSchema.safeParse(value);

//     if (!validatedFields.success) {
//         var test = validatedFields.error.issues
//     }
// }
