import { useQuestionsEditorContext } from '@/components/providers/questions-editor-provider'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const GroupNameFormSchema = z.object({
  groupName: z.string().min(2, 'At least 2 characters for group name').max(50),
})

export type GroupNameFormType = z.infer<typeof GroupNameFormSchema>;

export function QuestionsEditorHeader() {
  const groupName = useQuestionsEditorContext(state => state.name)
  const updateGroupName = useQuestionsEditorContext(state => state.updateGroupName)

  const { register, getValues, formState: { errors, isValid }, handleSubmit } = useForm<GroupNameFormType>({
    resolver: zodResolver(GroupNameFormSchema),
    values: { groupName },
    mode: 'onBlur'
  })

  const updateNameDebounced = useDebounce(handleSubmit(() => {
    const value = getValues()
    updateGroupName(value.groupName)
  }), 300)

  return (
    <form id="form-editor-subject" onChange={() => updateNameDebounced()}>
      <label className="relative m-8 mx-auto block xl:w-9/12">
        <Pencil className="absolute right-3 top-1/2 size-5 -translate-y-1/2" />
        <Input
          className="my-20 border-0 p-3 text-center text-3xl font-semibold hover:ring-1 hover:ring-secondary sm:py-7 sm:text-5xl"
          placeholder="Enter a group's name"
          type="text"
          {...register('groupName')}
        />
      </label>
      {errors.groupName && <p className="text-center text-sm font-medium text-destructive">{errors.groupName.message}</p>}
    </form>
  )
}
