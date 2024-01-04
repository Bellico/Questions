'use server';

import prisma from "@/lib/prisma";
import { QuestionGroupSchema, QuestionGroupType } from "@/lib/schema";
import { ActionErrorType, ZparseOrError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

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
                                create: q.responses.filter(r => !!r.text).map(r => ({
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

        return group.id
    }
    catch (error: any) {
        return {
            message: "Database Error: Failed to Create questions: " + error.message,
        };
    }
}

export const updateQuestionGroup = async (data: QuestionGroupType): Promise<bool | ActionErrorType> => {
    const errors = ZparseOrError(QuestionGroupSchema, data)
    if (errors) return errors

    try {
        await prisma.$transaction(async (tx) => {

            // 1. Update group
            const group = await prisma.questionGroup.update({
                where: {
                    id: data.id!,
                },
                data: {
                    name: data.name,
                },
            });

            // 2. Update Questions Or Create With Responses
            for (let i = 0; i < data.questions.length; i++) {
                const q = data.questions[i];
                console.log(q)
                await prisma.question.upsert({
                    where: {
                        id: q.id || 'xxx'
                    },
                    create: {
                        groupId: data.id!,
                        subject: q.subject,
                        responses: {
                            create: q.responses.filter(r => !!r.text).map(r => ({
                                isCorrect: r.isCorrect,
                                text: r.text
                            }))
                        }
                    },
                    update: {
                        subject: q.subject
                    }
                });

                // 3. Create / Update Responses for Updated Questions
                const updatedQuestion = data.questions.filter(q => !!q.id)
                for (let i = 0; i < updatedQuestion.length; i++) {

                    const q = updatedQuestion[i];
                    for (let j = 0; j < q.responses.length; j++) {

                        const r = q.responses[j];
                        if (!r.text) continue;

                        await prisma.response.upsert({
                            where: {
                                id: r.id || 'xxx'
                            },
                            create: {
                                questionId: q.id!,
                                text: r.text,
                                isCorrect: r.isCorrect
                            },
                            update: {
                                text: r.text,
                                isCorrect: r.isCorrect
                            }
                        });
                    }
                }
            }
        })

        revalidatePath('/board/')

        return true;
    }
    catch (error: any) {
        return {
            message: "Database Error: Failed to Update questions: " + error.message,
        };
    }
}

// const totest = (value: any) => {
//     const validatedFields = QuestionGroupSchema.safeParse(value);

//     if (!validatedFields.success) {
//         var test = validatedFields.error.issues
//     }
// }
