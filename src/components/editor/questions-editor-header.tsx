import { useQuestionsEditorContext } from "@/components/providers/questions-editor-provider";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/utils";
import { Pencil } from "lucide-react";
import { useShallow } from 'zustand/react/shallow';

export function QuestionsEditorHeader() {

    const [groupName, updateName] = useQuestionsEditorContext(
        useShallow((s) => [s.name, s.updateGroupName]),
    )

    const updateNameDebounced = useDebounce((value) => {
        updateName(value)
    }, 300)

    return (
        <label className="relative block xl:w-9/12 mx-auto m-8">
            <Pencil className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 right-3" />
            <Input
                className="border-0 p-3 text-xl mb-4 text-center hover:ring-1 hover:ring-secondary"
                placeholder="Enter a name for this group"
                type="text"
                defaultValue={groupName}
                onChange={(e) => updateNameDebounced(e.target.value)}
            />
        </label>
    )
}
