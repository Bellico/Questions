import prisma from "@/lib/prisma";

export const getGroupsListQuery = async (userId?: string) => {
    return await prisma.questionGroup.findMany({
        orderBy: {
            creationDate: 'desc',
        }
    });
}

export const getEditorQuery = async (groupId: string) => {
    return await prisma.questionGroup.findUnique({
        where: {
            id: groupId
        },
        select: {
            id: true,
            name: true,
            questions: {
                select: {
                    id: true,
                    subject: true,
                    responses: {
                        select: {
                            id: true,
                            text: true,
                            isCorrect: true
                        }
                    }
                }
            }
        }
    })
}
