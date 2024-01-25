import { AlertDraft } from "@/components/board/alert-draft";
import { QuestionGroupsList } from "@/components/board/question-groups-list";
import { BoardStats } from "@/components/board/stats";
import { SectionSpinner } from "@/components/commons/spinner";
import { Suspense } from "react";


export default async function BoardPage() {
  return (
    <>
      <Suspense fallback={<SectionSpinner />}>
        <BoardStats />
      </Suspense>

      <AlertDraft />
      <Suspense fallback={<SectionSpinner title="Question groups" />}>
        <QuestionGroupsList />
      </Suspense>
    </>
  )
}
