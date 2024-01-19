import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
        mode: "onBlur"
    })

    const updateNameDebounced = useDebounce(handleSubmit(() => {
        const value = getValues();
        updateGroupName(value.groupName)
    }), 300)

    return (
        <form onChange={() => updateNameDebounced()}>
            <label className="relative block xl:w-9/12 mx-auto m-8">
                <Pencil className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3" />
                <Input
                    className="border-0 p-3 text-3xl sm:text-5xl font-semibold sm:py-7 my-20 text-center hover:ring-1 hover:ring-secondary"
                    placeholder="Enter a group's name"
                    type="text"
                    {...register("groupName")}
                />
            </label>
            {errors.groupName && <p className="text-sm font-medium text-destructive text-center">{errors.groupName.message}</p>}
        </form>
    )
}
