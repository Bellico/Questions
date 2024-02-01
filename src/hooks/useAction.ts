import { useToast } from '@/components/ui/use-toast'
import { dispatchLoader } from '@/hooks/useLoader'
import { ActionResultType } from '@/lib/utils'
import { useEffect, useTransition } from 'react'

export function useAction() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    dispatchLoader(isPending)
    return () => dispatchLoader(false)
  },[isPending])

  async function requestAction<T> (
    action:  () => Promise<ActionResultType<T>>,
    onSuccess: (data?:T) => void,
    successMessage?: string
  ){
    startTransition(async () => {
      var result =  await action()

      if (result.success) {
        if(successMessage){
          toast({
            variant: 'success',
            title: successMessage,
          })
        }

        onSuccess(result.data)
      }else{
        toast({
          variant: 'destructive',
          title: 'Something wrong!',
          description: result.message + ' ' + JSON.stringify(result.errors),
        })
      }
    })
  }

  return requestAction
}

