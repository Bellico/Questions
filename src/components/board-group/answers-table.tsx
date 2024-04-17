'use client'

import { AnswersTableColumns } from '@/components/board-group/answers-table-columns'
import { DataTable } from '@/components/commons/data-table'
import { useDataTable } from '@/hooks/useDataTable'
import { ArrayType } from '@/lib/utils'
import { getAnwsersBoardQuery } from '@/queries/pages-queries'
import { useTranslation } from 'react-i18next'

type dataTableType = ArrayType<Awaited<ReturnType<typeof getAnwsersBoardQuery>>>

export function AnswersTable({ answersList } : { answersList: dataTableType[]} ) {
  const { t } = useTranslation('global')
  const columns = AnswersTableColumns(t)
  const table = useDataTable(answersList, columns)

  return (
    <DataTable table={table} />
  )
}
