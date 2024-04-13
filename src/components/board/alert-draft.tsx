'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { StepForward, Terminal } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const AlertDraft = () => {
  const { t } = useTranslation('global')
  const [hasDraft, setHasDraft] = useState(false)
  let draftId = useRef<string | undefined>(undefined)

  useEffect(() => {
    const storage = localStorage.getItem('q-editor')
    if (!storage) return

    draftId.current = JSON.parse(storage).json.state.id
    setHasDraft(true)
  }, [])

  if (!hasDraft) return

  return (
    <Alert>
      <Terminal className="size-4" />
      <AlertTitle>{t('DraftUnsaved')}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <p>{t('DraftUnsavedDesc')}</p>
        <Link href={`/editor/${draftId.current || ''}?useDraft=true`}>
          <Button variant="secondary">
            <StepForward className="mr-2 size-4" />
            {t('Continue')}
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  )
}
