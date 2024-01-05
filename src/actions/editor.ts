'use server';

import prisma from "@/lib/prisma";
import { QuestionGroupSchema, QuestionGroupType } from "@/lib/schema";
import { ActionErrorType, ZparseOrError } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import z from "zod";

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
            message: "Database Error: Failed to create questions group: " + error.message,
        };
    }
}

export const updateQuestionGroup = async (data: QuestionGroupType): Promise<boolean | ActionErrorType> => {
    const errors = ZparseOrError(QuestionGroupSchema, data)
    if (errors) return errors

    try {
        await prisma.$transaction(async (tx) => {

            // 1. Update group
            await prisma.questionGroup.update({
                where: {
                    id: data.id!,
                },
                data: {
                    name: data.name,
                },
            });

            // 2. Delete old Questions
            const questionIdToKeep = data.questions.filter(q => !!q.id).map(q => q.id!)
            await prisma.question.deleteMany({
                where: {
                    id: {
                        notIn: questionIdToKeep
                    },
                    groupId: {
                        equals: data.id!
                    }
                },
            })

            // 3. Update existing Questions Or Create New With Responses
            for (let i = 0; i < data.questions.length; i++) {
                const q = data.questions[i];

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

                // 4. Create / Update / Delete Responses for Updated Questions
                const updatedQuestion = data.questions.filter(q => !!q.id)
                for (let i = 0; i < updatedQuestion.length; i++) {

                    const q = updatedQuestion[i];
                    // Delete
                    await prisma.response.deleteMany({
                        where: {
                            id: {
                                notIn: q.responses.filter(r => !!r.id).map(r => r.id!)
                            }
                        }
                    })

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
                            },
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
            message: "Database Error: Failed to update questions group: " + error.message,
        };
    }
}

export const deleteQuestionGroup = async (id: string): Promise<boolean | ActionErrorType> => {
    const errors = ZparseOrError(z.string(), id)
    if (errors) return errors

    try {
        await prisma.questionGroup.delete({
            where: {
                id: id
            }
        })

        revalidatePath('/board')

        return true
    }
    catch (error: any) {
        return {
            message: "Database Error: Failed to delete questions group: " + error.message,
        };
    }
}
