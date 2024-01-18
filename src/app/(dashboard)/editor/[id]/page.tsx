import { updateQuestionGroup } from "@/actions/editor-actions";
import { getEditorQuery } from "@/actions/queries";
import QuestionGroupEditor from "@/components/editor/questions-editor";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function EditorPage({ params }: { params: { id: string } }) {

  const session = await auth();

  const questionGroup = await getEditorQuery(params.id, session?.user.id!)

  if (!questionGroup) {
    notFound()
  }

  return (
    <QuestionGroupEditor questionGroup={questionGroup} saveGroupAction={updateQuestionGroup} />
  )
}
