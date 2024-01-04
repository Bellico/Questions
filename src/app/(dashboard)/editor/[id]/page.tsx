import { updateQuestionGroup } from "@/actions/editor";
import QuestionGroupEditor from "@/components/editor/question-group-editor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditorPage({ params }: { params: { id: string } }) {

  const questionGroup = await prisma.questionGroup.findUnique({
    where: {
      id: params.id
    },
    select: {
      id: true,
      name: true,
      questions: {
        select: {
          id: true,
          subject: true,
          responses: true
        }
      }
    }
  })

  if (!questionGroup) {
    notFound()
  }

  return (
    <QuestionGroupEditor questionGroup={questionGroup} saveGroupAction={updateQuestionGroup} />
  )
}
