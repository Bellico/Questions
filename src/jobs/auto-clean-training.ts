import { PrismaClient, RoomMode } from '@prisma/client'

export function getIsoDate() {
  return new Date().toISOString().replace('T', '_').split('.')[0].replace(/:/g, '-')
}

export const autoCleanTrainingJob = async () => {
  const prisma = new PrismaClient()
  let result

  try {
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

      result = await tx.room.deleteMany({
        where:{
          dateEnd: {
            not: null
          },
          mode: RoomMode.Training
        },
      })

    })

    console.log(getIsoDate(), 'Training Rooms deleted:', result.count)
  } catch (error) {
    console.error(getIsoDate(), 'Delete Room Error:', error)
  }
}
