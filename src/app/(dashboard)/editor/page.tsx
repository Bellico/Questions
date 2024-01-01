import { createQuestionGroup } from "@/actions/editor";
import QuestionGroupEditor from "@/components/editor/question-group-editor";

export default async function EditorPage() {
  return (
    <QuestionGroupEditor onSubmit={createQuestionGroup} />
  )
}
