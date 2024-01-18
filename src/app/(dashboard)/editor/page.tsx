import { createQuestionGroup } from "@/actions/editor-actions";
import QuestionsEditor from "@/components/editor/questions-editor";

export default async function EditorPage() {
  return (
    <QuestionsEditor saveGroupAction={createQuestionGroup} />
  )
}
