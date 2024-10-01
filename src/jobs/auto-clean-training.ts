import { PrismaClient, RoomMode } from '@prisma/client'

export const autoCleanTrainingJob = async () => {
  const prisma = new PrismaClient()
  let result = 0

  await prisma.$transaction(async (tx) => {

    await tx.choices.deleteMany({
      where: {
        answer:{
          room: {
            dateEnd: {
              not: null
            },
            mode: RoomMode.Training
          }
        }
      }
    })

    await tx.answer.deleteMany({
      where: {
        room: {
          dateEnd: {
            not: null
          },
          mode: RoomMode.Training
        }
      }
    })

    const res = await tx.room.deleteMany({
      where:{
        dateEnd: {
          not: null
        },
        mode: RoomMode.Training
      },
    })

    result = res.count
  })

  prisma.$disconnect()

  return result
}
