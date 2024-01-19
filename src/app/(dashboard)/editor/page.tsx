import { createQuestionGroup } from "@/actions/editor-actions";
import { QuestionsEditor } from "@/components/editor/questions-editor";

export default async function EditorPage({ searchParams }: { searchParams: { useDraft: boolean } }) {
  return (
    <QuestionsEditor useDraft={searchParams.useDraft} saveGroupAction={createQuestionGroup} />
  )
}
