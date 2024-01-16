import { updateQuestionGroup } from "@/actions/editor-actions";
import { getEditorQuery } from "@/actions/queries";
import QuestionGroupEditor from "@/components/editor/question-group-editor";
import { notFound } from "next/navigation";

export default async function EditorPage({ params }: { params: { id: string } }) {

  const questionGroup = await getEditorQuery(params.id)

  if (!questionGroup) {
    notFound()
  }

  return (
    <QuestionGroupEditor questionGroup={questionGroup} saveGroupAction={updateQuestionGroup} />
  )
}
