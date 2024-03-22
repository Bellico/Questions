'use client'

import { getAnwsersBoardQuery } from '@/actions/queries'
import { DataTable } from '@/components/commons/data-table'
import { AnswersTableColumns } from '@/components/groupboard/answers-table-columns'
import { useDataTable } from '@/hooks/useDataTable'
import { ArrayType } from '@/lib/utils'

type dataTableType = ArrayType<Awaited<ReturnType<typeof getAnwsersBoardQuery>>>

export function AnswersTable({ answersList } : { answersList: dataTableType[]} ) {
  const table = useDataTable(answersList, AnswersTableColumns)

  return (
    <DataTable table={table} />
  )
}
