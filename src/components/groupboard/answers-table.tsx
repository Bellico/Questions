'use client'

import { DataTable } from '@/components/commons/data-table'
import { AnswersTableColumns } from '@/components/groupboard/answers-table-columns'
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
