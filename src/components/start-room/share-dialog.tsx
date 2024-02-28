import { shareRoomAction } from '@/actions/room/share-room-action'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RoomSettingsType } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Copy, Loader2, Share } from 'lucide-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ShareSchema = z.object({
  username: z.string().min(3)
}).refine(v => !!v.username)

type ShareSchemaType = z.infer<typeof ShareSchema>

export function ShareDialog( {settingValues} : { settingValues: () => RoomSettingsType}) {

  const shareLinkRef = useRef<string>('')

  const form = useForm<ShareSchemaType>({
    resolver: zodResolver(ShareSchema)
  })

  const { handleSubmit,
    register,
    formState: { isSubmitting, isSubmitSuccessful, errors, isValid },
  } = form

  const share = async ({username}: ShareSchemaType) => {
    const shareValues = { username, ...settingValues()}
    var result = await shareRoomAction(shareValues)

    if(result.success){
      shareLinkRef.current = result.data!
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary"><Share className="mr-2" />Get a share link</Button>
      </DialogTrigger>
      <DialogContent>
        <form id="form-share" onSubmit={handleSubmit(share)}>

          <DialogHeader>
            <DialogTitle>Share my questions</DialogTitle>
            <DialogDescription>
            You can ask anyone on your own questions, send him a link now.
            </DialogDescription>
          </DialogHeader>

          {!isSubmitSuccessful &&
            <div className="flex items-center gap-4 py-4">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                className="col-span-3"
                placeholder="A name or email"
                {...register('username')}/>
            </div>
          }

          {isSubmitSuccessful &&
            <div className="flex items-center space-x-2 py-4">
              <div className="flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">Link</Label>
                <Input id="link" defaultValue={shareLinkRef.current} readOnly />
              </div>
              <Button type="submit" size="sm" className="px-3" onClick={() => navigator.clipboard.writeText(shareLinkRef.current)}>
                <span className="sr-only">Copy</span>
                <Copy className="size-4" />
              </Button>
            </div>
          }

          {!isSubmitSuccessful &&
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting && <Loader2 className="-ml-1 mr-3 animate-spin" />}
                 Get a share link
              </Button>
            </DialogFooter>
          }

        </form>
      </DialogContent>
    </Dialog>
  )
}
