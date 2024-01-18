import prisma from "@/lib/prisma";

export const getGroupsListQuery = async (userId: string) => {
    return await prisma.questionGroup.findMany({
        where: {
            authorId: userId,
        },
        orderBy: {
            creationDate: 'desc',
        },
        include: {
            _count: {
                select: { questions: true },
            },
        }
    });
}

export const getEditorQuery = async (groupId: string, userId: string) => {
    return await prisma.questionGroup.findUnique({
        where: {
            id: groupId,
            authorId: userId,
        },
        select: {
            id: true,
            name: true,
            questions: {
                orderBy: {
                    order: 'asc'
                },
                select: {
                    id: true,
                    title: true,
                    subject: true,
                    order: true,
                    responses: {
                        select: {
                            id: true,
                            text: true,
                            isCorrect: true
                        }
                    }
                }
            }
        },
    })
}
