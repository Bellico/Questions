'use server'

import { getSessionUserIdOrThrow, isGroupOwnerOrThrow } from '@/actions/queries'
import prisma from '@/lib/prisma'
import { RoomSettingsSchema, RoomShareType } from '@/lib/schema'
import { ActionResultType, ZparseOrError } from '@/lib/utils'

export const shareRoomAction = async (data: RoomShareType): Promise<ActionResultType<string>> => {
  const errors = ZparseOrError(RoomSettingsSchema, data)
  if (errors) return errors

  const userId = await getSessionUserIdOrThrow()
  await isGroupOwnerOrThrow(data.groupId, userId)

  let friend = await prisma.user.findUnique({
    where:{
      email: data.username
    }
  })

  try {
    const room = await prisma.$transaction(async (tx) => {

      if(!friend){
        friend = await tx.user.create({
          data:{
            email: data.username
          }
        })
      }

      const room = await tx.room.create({
        data: {
          groupId: data.groupId,
          userId: friend.id,
          mode: data.mode,
          withTimer: data.withTimer,
          withResults: data.withResults,
          withCorrection: data.withCorrection,
          withRandom: data.withRandom,
          withProgress: data.withProgress,
          shareLink: crypto.randomUUID()
        }
      })

      return room
    })

    const shareUrl = `${process.env.PUBLIC_URL}/share/${room.id}/?shareLink=${room.shareLink}`

    return {
      success: true,
      data: shareUrl
    }
  }
  catch (error: any) {
    return {
      success: false,
      message: 'Database Error: Failed to share room: ' + error.message,
    }
  }
}
