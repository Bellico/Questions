import { createQuestionGroup } from "@/actions/editor-actions";
import QuestionGroupEditor from "@/components/editor/question-group-editor";

export default async function EditorPage() {
  return (
    <QuestionGroupEditor saveGroupAction={createQuestionGroup} />
  )
}
